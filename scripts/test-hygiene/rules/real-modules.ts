// Based on no-module-mock from sisyphuslabs/dori-superagent, including ideas from
// interfere-inc/landmines 0.1.0 (MIT)'s no-test-doubles check.
import { children, dotted, field, identifier, propertyKey, textLiteral } from "./syntax.ts";
import type { TestRule, Tree } from "./syntax.ts";

const replaceMethods: Readonly<Record<string, readonly string[]>> = {
  "bun:test/mock": ["module"],
  "bun:test/vi": ["mock"],
  "vitest/vi": ["mock", "doMock"],
  "vitest/vitest": ["mock", "doMock"],
  "@jest/globals/jest": ["mock", "doMock", "unstable_mockModule"],
};
const runners = new Set(["bun:test", "vitest", "@jest/globals"]);
const globals = new Map([
  ["vi", "vitest/vi"],
  ["vitest", "vitest/vitest"],
  ["jest", "@jest/globals/jest"],
]);
const wrappers = new Set([
  "TSAsExpression",
  "TSSatisfiesExpression",
  "TSNonNullExpression",
  "TSTypeAssertion",
  "ParenthesizedExpression",
]);

function unwrap(node: Tree | undefined): Tree | undefined {
  while (node && (wrappers.has(node.type) || node.type === "AwaitExpression")) {
    node = field(node, node.type === "AwaitExpression" ? "argument" : "expression");
  }
  return node;
}

function loaderSource(node: Tree): string | undefined {
  if (node.type === "ImportExpression") return textLiteral(field(node, "source"));
  if (node.type !== "CallExpression") return undefined;
  const load = unwrap(field(node, "callee"));
  if (
    identifier(load) === "require" ||
    (load?.type === "CallExpression" && identifier(unwrap(field(load, "callee"))) === "createRequire")
  ) {
    return textLiteral(children(node, "arguments")[0]);
  }
  return undefined;
}

function observesRealModule(call: Tree): boolean {
  const [, options, extra] = children(call, "arguments");
  if (extra || options?.type !== "ObjectExpression") return false;
  const [setting, more] = children(options, "properties");
  const value = field(setting, "value");
  return (
    !more &&
    setting !== undefined &&
    propertyKey(setting) === "spy" &&
    value?.type === "Literal" &&
    value["value"] === true
  );
}

type Origin = { readonly kind: "namespace" | "mocker"; readonly name: string } | { readonly kind: "other" };
type Reference = { readonly base: string | Origin; readonly picks: readonly string[] };

const namespace = (name: string): Origin => ({ kind: "namespace", name });
const mocker = (name: string): Origin => ({ kind: "mocker", name });
const other = { kind: "other" } as const;

function select(origin: Origin, key: string | undefined): Origin {
  if (origin.kind !== "namespace" || !key) return other;
  const exported = `${origin.name}/${key}`;
  return Object.hasOwn(replaceMethods, exported) ? mocker(exported) : other;
}

function memberKey(node: Tree): string | undefined {
  return node["computed"] === true ? textLiteral(field(node, "property")) : dotted(node);
}

function reference(expr: Tree | undefined): Reference | undefined {
  const picks: string[] = [];
  let node = unwrap(expr);
  while (node?.type === "MemberExpression") {
    const key = memberKey(node);
    if (!key) return undefined;
    picks.push(key);
    node = unwrap(field(node, "object"));
  }
  if (!node) return undefined;
  const name = identifier(node);
  if (name) return { base: name, picks: picks.reverse() };
  const source = loaderSource(node);
  return source && runners.has(source) ? { base: namespace(source), picks: picks.reverse() } : undefined;
}

const applyPicks = (origin: Origin, picks: readonly string[]): Origin => picks.reduce(select, origin);
const mockMethods = new Set(Object.values(replaceMethods).flat());

export const realModules: TestRule = {
  meta: {
    type: "problem",
    messages: {
      replacement: "Do not replace a whole module. Inject the dependency or use a real fake at the boundary.",
    },
  },
  create(context) {
    const imports = new Map<string, Origin>();
    const seeds: { readonly local: string; readonly origin: Origin }[] = [];
    const dependents = new Map<string, { readonly local: string; readonly picks: readonly string[] }[]>();
    const calls: Tree[] = [];

    function addAlias(local: string | undefined, ref: Reference, pick?: string): void {
      if (!local) return;
      const picks = pick === undefined ? ref.picks : [...ref.picks, pick];
      if (typeof ref.base !== "string") {
        seeds.push({ local, origin: applyPicks(ref.base, picks) });
      } else {
        const next = dependents.get(ref.base) ?? [];
        next.push({ local, picks });
        dependents.set(ref.base, next);
      }
    }

    return {
      ImportDeclaration(node) {
        const source = textLiteral(field(node, "source"));
        const runner = source && runners.has(source) && node["importKind"] !== "type" ? namespace(source) : other;
        for (const specifier of children(node, "specifiers")) {
          const local = identifier(field(specifier, "local"));
          if (!local) continue;
          const imported = field(specifier, "imported");
          const origin =
            specifier.type === "ImportNamespaceSpecifier"
              ? runner
              : specifier.type === "ImportSpecifier" && specifier["importKind"] !== "type"
                ? select(runner, identifier(imported) ?? textLiteral(imported))
                : other;
          imports.set(local, origin);
        }
      },
      VariableDeclarator(node) {
        const pattern = field(node, "id");
        const ref = reference(field(node, "init"));
        if (!ref) return;
        if (pattern?.type !== "ObjectPattern") {
          addAlias(identifier(pattern), ref);
          return;
        }
        for (const property of children(pattern, "properties")) {
          if (property.type !== "Property") continue;
          const key = field(property, "key");
          const pick = identifier(key) ?? textLiteral(key);
          const target = field(property, "value");
          if (pick)
            addAlias(identifier(target?.type === "AssignmentPattern" ? field(target, "left") : target), ref, pick);
        }
      },
      CallExpression(node) {
        const callee = unwrap(field(node, "callee"));
        if (callee?.type === "MemberExpression" && mockMethods.has(memberKey(callee) ?? "")) calls.push(node);
      },
      "Program:exit"() {
        if (!calls.length) return;
        // Propagate known sources through aliases once per name. Cycles unrelated to a runner need no walk.
        const origins = new Map(imports);
        const queue: string[] = [...imports.keys()];
        function bind(local: string, origin: Origin): void {
          if (origins.has(local) || origin.kind === "other") return;
          origins.set(local, origin);
          queue.push(local);
        }
        for (const { local, origin } of seeds) bind(local, origin);
        for (const [name, source] of globals) bind(name, mocker(source));
        for (const local of queue) {
          const origin = origins.get(local) ?? other;
          for (const alias of dependents.get(local) ?? []) bind(alias.local, applyPicks(origin, alias.picks));
        }

        for (const call of calls) {
          const callee = unwrap(field(call, "callee"));
          if (!callee) continue;
          const ref = reference(field(callee, "object"));
          if (!ref) continue;
          const base = typeof ref.base === "string" ? (origins.get(ref.base) ?? other) : ref.base;
          const receiver = applyPicks(base, ref.picks);
          if (receiver.kind !== "mocker" || !replaceMethods[receiver.name]?.includes(memberKey(callee) ?? "")) continue;
          if (receiver.name.startsWith("vitest/") && observesRealModule(call)) continue;
          context.report({ node: call, messageId: "replacement" });
        }
      },
    };
  },
};
