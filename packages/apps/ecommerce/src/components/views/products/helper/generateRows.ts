import keyOf from "./keyOf";
import makeCombinations from "./makeCombinations";
import skuFrom from "./skuFrom";

function generateRows(types: { id: string; values: string[] }[], oldRows: any[] = []) {
  return makeCombinations(types).map((attrs, index) => {
    const oldRow = oldRows.find((r) => keyOf(r.attrs, types) === keyOf(attrs, types));
    return oldRow || { id: Date.now() + index, attrs, sku: skuFrom(attrs), overridePrice: "", stock: 0, active: true };
  });
}

export default generateRows;
