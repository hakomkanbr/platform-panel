function makeCombinations(types: { id: string; values: string[] }[]) {
  const validTypes = types.filter((t) => t.values.length > 0);
  if (!validTypes.length) return [];
  return validTypes.reduce(
    (rows, type) => rows.flatMap((row) => type.values.map((value) => ({ ...row, [type.id]: value }))),
    [{}],
  );
}

export default makeCombinations;
