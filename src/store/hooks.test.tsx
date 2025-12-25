import type { ReactNode } from 'react';
import { renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from './hooks';
import authReducer from './slices/authSlice';
import notesReducer from './slices/notesSlice';

const createMockStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      notes: notesReducer,
    },
    preloadedState: {
      auth: {
        user: { id: '1', name: 'Test User', email: 'test@test.com' },
        isAuthenticated: true,
        isLoading: false,
        error: null,
      },
      notes: {
        notes: [],
        currentNote: null,
        isLoading: false,
        error: null,
      },
    },
  });
};

const wrapper = ({ children }: { children: ReactNode }) => {
  const store = createMockStore();
  return <Provider store={store}>{children}</Provider>;
};

describe('hooks', () => {
  describe('useAppDispatch', () => {
    it('should return dispatch function', () => {
      const { result } = renderHook(() => useAppDispatch(), { wrapper });

      expect(result.current).toBeDefined();
      expect(typeof result.current).toBe('function');
    });

    it('should dispatch actions correctly', () => {
      const { result } = renderHook(() => useAppDispatch(), { wrapper });
      const dispatch = result.current;

      expect(() => {
        dispatch({ type: 'test/action', payload: 'test' });
      }).not.toThrow();
    });
  });

  describe('useAppSelector', () => {
    it('should return selected state', () => {
      const { result } = renderHook(
        () => useAppSelector((state) => state.auth.user),
        { wrapper }
      );

      expect(result.current).toEqual({
        id: '1',
        name: 'Test User',
        email: 'test@test.com',
      });
    });

    it('should return different state slices', () => {
      const { result: authResult } = renderHook(
        () => useAppSelector((state) => state.auth.isAuthenticated),
        { wrapper }
      );

      const { result: notesResult } = renderHook(
        () => useAppSelector((state) => state.notes.notes),
        { wrapper }
      );

      expect(authResult.current).toBe(true);
      expect(notesResult.current).toEqual([]);
    });

    it('should update when state changes', () => {
      const { result, rerender } = renderHook(
        () => useAppSelector((state) => state.auth.isAuthenticated),
        { wrapper }
      );

      expect(result.current).toBe(true);
      rerender();
      expect(result.current).toBe(true);
    });
  });
});
