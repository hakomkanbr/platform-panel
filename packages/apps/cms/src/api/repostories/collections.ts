import api from "../api-context";
import api_points from "../points";

export interface CollectionItem {
  id?: number;
  key: string;
  value: string;
}

export interface Collection {
  id?: number;
  name: string;
  slug: string;
  published: boolean;
  items: CollectionItem[];
  itemsCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CollectionListParams {
  pageSize?: number;
  currentPage?: number;
  search?: string;
}

export interface CollectionListResponse {
  data: Collection[];
  total: number;
}

export const collectionsRepository = {
  // Get all collections with pagination and search
  getAll: async (params?: CollectionListParams): Promise<CollectionListResponse> => {
    const response = await api.get(api_points.collection.getAll, { params });
    return response.data;
  },

  // Get single collection by ID
  getById: async (id: number): Promise<Collection> => {
    const response = await api.get(`${api_points.collection.getOne}/${id}`);
    return response.data;
  },

  // Create new collection
  create: async (collection: Omit<Collection, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ id: number }> => {
    const response = await api.post(api_points.collection.create, collection);
    return response.data;
  },

  // Update existing collection
  update: async (id: number, collection: Partial<Collection>): Promise<void> => {
    await api.put(`${api_points.collection.update}/${id}`, collection);
  },

  // Delete collection
  delete: async (id: number): Promise<void> => {
    await api.delete(`${api_points.collection.delete}/${id}`);
  },

  // Change collection state (published/unpublished)
  changeState: async (id: number, published: boolean): Promise<void> => {
    await api.post(`${api_points.collection.changeState}/${id}`, { published });
  }
};

export default collectionsRepository;