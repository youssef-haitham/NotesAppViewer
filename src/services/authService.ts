import api from './api';
import type { SignInRequest, SignUpRequest, AuthResponse } from '../types/auth.types';

export const signIn = async (credentials: SignInRequest): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/api/auth/signin', credentials);
  return response.data;
};

export const signUp = async (userData: SignUpRequest): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/api/auth/signup', userData);
  return response.data;
};

export const getCurrentUser = async (): Promise<AuthResponse> => {
  const response = await api.get<AuthResponse>('/api/auth/me');
  return response.data;
};

export const logout = async (): Promise<void> => {
  await api.post('/api/auth/logout');
};
