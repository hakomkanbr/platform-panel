export interface Brand {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  imageName: string | null;
}

export interface BrandFormData {
  name: string;
  slug: string;
  description?: string;
  imageName?: string;
}
