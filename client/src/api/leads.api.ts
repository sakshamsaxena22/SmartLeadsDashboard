import api from './axios';
import type { ApiResponse, PaginatedResponse, ILead, LeadQueryParams } from '../types';
import type { CreateLeadSchemaType, UpdateLeadSchemaType } from '../../../shared/validators/lead.validator';

export const leadsApi = {
  getAll: (params: LeadQueryParams) =>
    api.get<PaginatedResponse<ILead>>('/leads', { params }),

  getById: (id: string) =>
    api.get<ApiResponse<ILead>>(`/leads/${id}`),

  create: (data: CreateLeadSchemaType) =>
    api.post<ApiResponse<ILead>>('/leads', data),

  update: (id: string, data: UpdateLeadSchemaType) =>
    api.put<ApiResponse<ILead>>(`/leads/${id}`, data),

  delete: (id: string) =>
    api.delete<ApiResponse<null>>(`/leads/${id}`),

  exportCsv: (params?: LeadQueryParams) =>
    api.get('/leads/export', {
      params,
      responseType: 'blob',
    }),
};
