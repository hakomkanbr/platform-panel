import { generateSlug } from "../commerce/utils/slug";

function slug(text: any) {
  return generateSlug(text);
}

export { generateSlug };
export default slug;