import { apiClient } from './client';
import type { User, LoginRequest, RegisterRequest, AuthResponse } from '@/types';

export async function registerUser(data: RegisterRequest): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>('/auth/register', data);
  if (response.data.token) {
    localStorage.setItem('sudoku_token', response.data.token);
  }
  return response.data;
}

export async function loginUser(data: LoginRequest): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>('/auth/login', data);
  if (response.data.token) {
    localStorage.setItem('sudoku_token', response.data.token);
  }
  return response.data;
}

export async function getCurrentUser(): Promise<User> {
  const response = await apiClient.get<{ user: User }>('/auth/me');
  return response.data.user;
}

export function logoutUser(): void {
  localStorage.removeItem('sudoku_token');
}
