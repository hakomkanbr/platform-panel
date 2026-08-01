export interface Category {
  id: number;
  parentId: number | null;
  name: string;
  slug: string;
  imageName: string | null;
  description: string | null;
  children: Category[];
}

export interface CategoryFormData {
  parentId?: number | null;
  name: string;
  slug: string;
  imageName?: string;
  description?: string;
}
