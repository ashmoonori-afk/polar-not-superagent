// Based on no-fixed-sleep from interfere-inc/landmines 0.1.0 (MIT), via sisyphuslabs/dori-superagent.
import { calleeHead, children, dotted, field, identifier, textLiteral } from "./syntax.ts";
import type { TestRule, Tree } from "./syntax.ts";

const testEntries = new Set(["test", "it", "beforeEach", "afterEach", "beforeAll", "afterAll"]);
const functionTypes = new Set(["ArrowFunctionExpression", "FunctionExpression", "FunctionDeclaration"]);

function insideTest(node: Tree): boolean {
  for (let owner = field(node, "parent"); owner; owner = field(owner, "parent")) {
    if (!functionTypes.has(owner.type)) continue;
    const registration = field(owner, "parent");
    const name = calleeHead(field(registration, "callee"), true);
    return registration?.type === "CallExpression" && name !== undefined && testEntries.has(name);
  }
  return false;
}

function singleExpression(fn: Tree | undefined): Tree | undefined {
  const body = field(fn, "body");
  if (body?.type !== "BlockStatement") return body;
  const [statement, extra] = children(body, "body");
  return !extra && statement?.type === "ExpressionStatement" ? field(statement, "expression") : undefined;
}

function isTimerPromise(node: Tree): boolean {
  if (identifier(field(node, "callee")) !== "Promise") return false;
  const [executor] = children(node, "arguments");
  if (executor?.type !== "ArrowFunctionExpression" && executor?.type !== "FunctionExpression") return false;
  const resolveName = identifier(children(executor, "params")[0]);
  const timer = singleExpression(executor);
  if (!resolveName || timer?.type !== "CallExpression") return false;
  const schedule = field(timer, "callee");
  const receiver = identifier(field(schedule, "object"));
  if (
    identifier(schedule) !== "setTimeout" &&
    !(dotted(schedule) === "setTimeout" && (receiver === "globalThis" || receiver === "window"))
  )
    return false;
  const [callback] = children(timer, "arguments");
  if (identifier(callback) === resolveName) return true;
  const callbackBody = field(callback, "body");
  return (
    callback?.type === "ArrowFunctionExpression" &&
    callbackBody?.type === "CallExpression" &&
    identifier(field(callbackBody, "callee")) === resolveName
  );
}

export const eventDriven: TestRule = {
  meta: {
    type: "problem",
    messages: { sleep: "Wait for completion, not a fixed delay. Use fake timers when the test needs to move time." },
  },
  create(context) {
    const sleepImports = new Set<string>();
    let usingFakeClock = false;
    return {
      ImportDeclaration(node) {
        const source = textLiteral(field(node, "source"));
        if (source !== "timers/promises" && source !== "node:timers/promises") return;
        for (const item of children(node, "specifiers")) {
          if (item.type !== "ImportSpecifier" || identifier(field(item, "imported")) !== "setTimeout") continue;
          const name = identifier(field(item, "local"));
          if (name) sleepImports.add(name);
        }
      },
      CallExpression(node) {
        const callee = field(node, "callee");
        if (dotted(callee) === "useFakeTimers" && identifier(field(callee, "object")) === "vi") {
          usingFakeClock = true;
        }
      },
      AwaitExpression(node) {
        const arg = field(node, "argument");
        if (usingFakeClock || !arg || !insideTest(node)) return;
        const callee = field(arg, "callee");
        const operation = `${identifier(field(callee, "object"))}.${dotted(callee)}`;
        const isDelay =
          arg.type === "NewExpression"
            ? isTimerPromise(arg)
            : arg.type === "CallExpression" &&
              (sleepImports.has(identifier(callee) ?? "") ||
                operation === "Bun.sleep" ||
                operation === "scheduler.wait");
        if (isDelay) context.report({ node, messageId: "sleep" });
      },
    };
  },
};
