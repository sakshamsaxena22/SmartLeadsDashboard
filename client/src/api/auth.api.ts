import api from './axios';
import type { ApiResponse, AuthResponse } from '../types';
import type { RegisterSchemaType, LoginSchemaType } from '../../../shared/validators/auth.validator';

export const authApi = {
  register: (data: RegisterSchemaType) =>
    api.post<ApiResponse<AuthResponse>>('/auth/register', data),

  login: (data: LoginSchemaType) =>
    api.post<ApiResponse<AuthResponse>>('/auth/login', data),

  getMe: () =>
    api.get<ApiResponse<AuthResponse['user']>>('/auth/me'),

  logout: () =>
    api.post<ApiResponse<null>>('/auth/logout'),
};
