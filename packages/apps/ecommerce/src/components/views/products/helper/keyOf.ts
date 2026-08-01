function keyOf(attrs: Record<string, string>, types: { id: string }[]) {
  return types.map((t) => `${t.id}:${attrs[t.id] || ""}`).join("|");
}

export default keyOf;
