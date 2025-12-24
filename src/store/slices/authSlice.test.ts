import authReducer, {
  clearError,
  clearUser,
  resetAuth,
  setError,
  setLoading,
  setUser,
} from '../authSlice';
import type { User } from '../../../types/auth.types';

const mockUser: User = {
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
};

describe('authSlice', () => {
  const initialState = {
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  };

  it('should return initial state', () => {
    expect(authReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('setUser', () => {
    it('should set user and authenticate', () => {
      const authResponse = mockUser;
      const action = setUser(authResponse);
      const state = authReducer(initialState, action);

      expect(state.user).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });
  });

  describe('clearUser', () => {
    it('should clear user and unauthenticate', () => {
      const stateWithUser = {
        ...initialState,
        user: mockUser,
        isAuthenticated: true,
      };
      const action = clearUser();
      const state = authReducer(stateWithUser, action);

      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.error).toBeNull();
    });
  });

  describe('setLoading', () => {
    it('should set loading state', () => {
      const action = setLoading(false);
      const state = authReducer(initialState, action);

      expect(state.isLoading).toBe(false);
    });
  });

  describe('setError', () => {
    it('should set error message', () => {
      const errorMessage = 'Test error';
      const action = setError(errorMessage);
      const state = authReducer(initialState, action);

      expect(state.error).toBe(errorMessage);
    });

    it('should clear error when set to null', () => {
      const stateWithError = {
        ...initialState,
        error: 'Previous error',
      };
      const action = setError(null);
      const state = authReducer(stateWithError, action);

      expect(state.error).toBeNull();
    });
  });

  describe('clearError', () => {
    it('should clear error', () => {
      const stateWithError = {
        ...initialState,
        error: 'Test error',
      };
      const action = clearError();
      const state = authReducer(stateWithError, action);

      expect(state.error).toBeNull();
    });
  });

  describe('resetAuth', () => {
    it('should reset auth state', () => {
      const stateWithData = {
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
        error: 'Some error',
      };
      const action = resetAuth();
      const state = authReducer(stateWithData, action);

      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.error).toBeNull();
    });
  });
});

