// The small part of oxlint's ESTree interface used by these checks.
export type Tree = { readonly type: string; readonly [field: string]: unknown };
export type TestRule = {
  readonly meta: {
    readonly type: "problem";
    readonly messages: Readonly<Record<string, string>>;
  };
  readonly create: (context: {
    readonly report: (finding: { readonly node: Tree; readonly messageId: string }) => void;
  }) => Readonly<Record<string, (node: Tree) => void>>;
};

const isTree = (value: unknown): value is Tree =>
  typeof value === "object" && value !== null && "type" in value && typeof value.type === "string";

export function field(node: Tree | undefined, key: string): Tree | undefined {
  const value = node?.[key];
  return isTree(value) ? value : undefined;
}

export function children(node: Tree | undefined, key: string): readonly Tree[] {
  const value = node?.[key];
  return Array.isArray(value) ? value.filter(isTree) : [];
}

export function identifier(node: Tree | undefined): string | undefined {
  return node?.type === "Identifier" && typeof node["name"] === "string" ? node["name"] : undefined;
}

export function textLiteral(node: Tree | undefined): string | undefined {
  return node?.type === "Literal" && typeof node["value"] === "string" ? node["value"] : undefined;
}

export function propertyKey(node: Tree): string | undefined {
  if (node.type !== "Property" || node["computed"] === true) return undefined;
  const key = field(node, "key");
  return identifier(key) ?? textLiteral(key);
}

export function dotted(node: Tree | undefined): string | undefined {
  if (node?.type !== "MemberExpression" || node["computed"] === true) return undefined;
  return identifier(field(node, "property"));
}

export function calleeHead(node: Tree | undefined, followTags = false): string | undefined {
  switch (node?.type) {
    case "MemberExpression":
      return calleeHead(field(node, "object"), followTags);
    case "CallExpression":
      return calleeHead(field(node, "callee"), followTags);
    case "TaggedTemplateExpression":
      return followTags ? calleeHead(field(node, "tag"), followTags) : undefined;
    default:
      return identifier(node);
  }
}
