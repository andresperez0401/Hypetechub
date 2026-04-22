import { apiClient } from './client';
import type { AuthScaffoldResponse, LoginInput, RegisterInput } from '@/lib/types/auth';

export async function login(payload: LoginInput): Promise<AuthScaffoldResponse> {
  const response = await apiClient.post<AuthScaffoldResponse>('/auth/login', payload);
  return response.data;
}

export async function register(payload: RegisterInput): Promise<AuthScaffoldResponse> {
  const response = await apiClient.post<AuthScaffoldResponse>('/auth/register', payload);
  return response.data;
}
