import api from './api';
import { signIn, signUp, getCurrentUser, logout } from './authService';
import type { SignInRequest, SignUpRequest, AuthResponse } from '../types/auth.types';

// Mock api
jest.mock('./api');
const mockApi = api as jest.Mocked<typeof api>;

describe('authService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('signIn', () => {
    it('should call api.post with correct endpoint and credentials', async () => {
      const credentials: SignInRequest = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockResponse: AuthResponse = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
      };

      mockApi.post.mockResolvedValue({ data: mockResponse } as any);

      const result = await signIn(credentials);

      expect(mockApi.post).toHaveBeenCalledWith('/api/auth/signin', credentials);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('signUp', () => {
    it('should call api.post with correct endpoint and user data', async () => {
      const userData: SignUpRequest = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      const mockResponse: AuthResponse = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
      };

      mockApi.post.mockResolvedValue({ data: mockResponse } as any);

      const result = await signUp(userData);

      expect(mockApi.post).toHaveBeenCalledWith('/api/auth/signup', userData);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getCurrentUser', () => {
    it('should call api.get with correct endpoint', async () => {
      const mockResponse: AuthResponse = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
      };

      mockApi.get.mockResolvedValue({ data: mockResponse } as any);

      const result = await getCurrentUser();

      expect(mockApi.get).toHaveBeenCalledWith('/api/auth/me');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('logout', () => {
    it('should call api.post with correct endpoint', async () => {
      mockApi.post.mockResolvedValue({} as any);

      await logout();

      expect(mockApi.post).toHaveBeenCalledWith('/api/auth/logout');
    });
  });
});

