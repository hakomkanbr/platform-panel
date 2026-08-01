import slug from "@/lib/slug";

function skuFrom(attrs: Record<string, string>) {
  return "AMB-" + Object.values(attrs).map((v) => slug(v).slice(0, 5).toUpperCase()).join("-");
}

export default skuFrom;
