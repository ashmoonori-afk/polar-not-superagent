// Based on no-flake-masking from interfere-inc/landmines 0.1.0 (MIT), via sisyphuslabs/dori-superagent.
import { calleeHead, children, dotted, field, identifier, propertyKey } from "./syntax.ts";
import type { TestRule, Tree } from "./syntax.ts";

const registrations = new Set(["test", "it", "describe", "suite"]);
const factories = new Set(["each", "for", "extend", "scoped", "override"]);

export const firstAttempt: TestRule = {
  meta: {
    type: "problem",
    messages: {
      retry: "Do not retry a failing test. Make the first attempt reliable by waiting for the event it needs.",
      timeout: "Do not raise the test timeout. Wait for the right event or move shared setup into a hook.",
    },
  },
  create(context) {
    function checkOptions(options: Tree | undefined, timeoutKeys: readonly string[]): void {
      if (options?.type !== "ObjectExpression") return;
      for (const option of children(options, "properties")) {
        const key = propertyKey(option);
        if (key === "retry") context.report({ node: option, messageId: "retry" });
        else if (key && timeoutKeys.includes(key)) context.report({ node: option, messageId: "timeout" });
      }
    }

    return {
      Property(node) {
        if (propertyKey(node) === "test") checkOptions(field(node, "value"), []);
      },
      CallExpression(node) {
        const callee = field(node, "callee");
        const [first, second, third] = children(node, "arguments");
        const method = dotted(callee) ?? "";
        if (method === "setConfig" && identifier(field(callee, "object")) === "vi") {
          checkOptions(first, ["testTimeout", "hookTimeout"]);
        } else if (registrations.has(calleeHead(callee) ?? "") && !factories.has(method)) {
          checkOptions(second, ["timeout"]);
          checkOptions(third, ["timeout"]);
          if (
            third &&
            second?.type !== "ObjectExpression" &&
            !["ObjectExpression", "ArrowFunctionExpression", "FunctionExpression"].includes(third.type)
          ) {
            context.report({ node: third, messageId: "timeout" });
          }
        }
      },
    };
  },
};
