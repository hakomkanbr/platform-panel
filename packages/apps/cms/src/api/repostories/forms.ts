import api_points from "../points";
import api from "../api-context";
import { 
  Form, 
  FormListingParams, 
  FormSubmissionListingParams,
  FormStats 
} from "@/types/form";

interface CreateFormData extends Omit<Form, 'id' | 'createdAt' | 'updatedAt' | 'submissionsCount'> {}

interface UpdateFormData extends CreateFormData {
  id: number;
}

class FormsRepository {

  constructor() {
  }

  // Forms Management
  async getAll(params?: FormListingParams) {
    return await api.get(api_points.form.getAll, { params });
  }

  async getOne(id: number) {
    return (await api.get(`${api_points.form.getOne}?id=${id}`)).data;
  }

  async create(data: CreateFormData) {
    return await api.post(api_points.form.create, data);
  }

  async update(data: UpdateFormData) {
    return await api.put(api_points.form.update, data);
  }

  async delete(id: number) {
    return await api.delete(`${api_points.form.delete}?id=${id}`);
  }

  async changeState(id: number, isActive: boolean) {
    return await api.post(api_points.form.changeState, { id, isActive });
  }

  async getForSelect() {
    return (await api.get(api_points.form.getForSelect)).data;
  }

  // Form Submissions
  async getSubmissions(params?: FormSubmissionListingParams) {
    return (await api.get(api_points.form.getSubmissions, { params })).data;
  }

  async getSubmission(id: number) {
    return (await api.get(`${api_points.form.getSubmission}/${id}`)).data;
  }

  async deleteSubmission(id: number) {
    return await api.delete(`${api_points.form.deleteSubmission}?id=${id}`);
  }

  // Utility methods
  async exportSubmissions(formId?: number, format: 'csv' | 'excel' = 'csv') {
    const params = { formId, format };
    return await api.get(api_points.form.exportSubmissions, { params });
  }

  async getFormStats(formId?: number): Promise<FormStats> {
    const params = formId ? { formId } : {};
    return (await api.get(api_points.form.getStats, { params })).data;
  }
}

const formsRepository = new FormsRepository();
export default formsRepository;