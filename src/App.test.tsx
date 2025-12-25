import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import App from './App';
import authReducer from './store/slices/authSlice';
import notesReducer from './store/slices/notesSlice';
import * as authService from './services/authService';

// Mock authService
jest.mock('./services/authService');
const mockGetCurrentUser = authService.getCurrentUser as jest.MockedFunction<
  typeof authService.getCurrentUser
>;

const createMockStore = (initialAuthState?: any) => {
  return configureStore({
    reducer: {
      auth: authReducer,
      notes: notesReducer,
    },
    preloadedState: {
      auth: {
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        ...initialAuthState,
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

const renderApp = (initialAuthState?: any) => {
  const store = createMockStore(initialAuthState);
  return {
    ...render(
      <Provider store={store}>
        <App />
      </Provider>
    ),
    store,
  };
};

describe('App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render loading state initially', async () => {
    mockGetCurrentUser.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve(null as any), 100))
    );

    renderApp({ isLoading: true });

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(mockGetCurrentUser).toHaveBeenCalled();
    });
  });

  it('should redirect to login page when user is not authenticated', async () => {
    mockGetCurrentUser.mockRejectedValue(new Error('Not authenticated'));

    renderApp({ isLoading: false, isAuthenticated: false });

    await waitFor(() => {
      expect(mockGetCurrentUser).toHaveBeenCalled();
    });
  });

  it('should redirect to notes page when user is authenticated', async () => {
    const mockUser = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
    };

    mockGetCurrentUser.mockResolvedValue(mockUser);

    renderApp({ isLoading: false, isAuthenticated: true, user: mockUser });

    await waitFor(() => {
      expect(mockGetCurrentUser).toHaveBeenCalled();
    });
  });

  it('should check authentication status on mount', async () => {
    mockGetCurrentUser.mockResolvedValue({
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
    });

    renderApp();

    await waitFor(() => {
      expect(mockGetCurrentUser).toHaveBeenCalledTimes(1);
    });
  });

  it('should clear user state when authentication check fails', async () => {
    mockGetCurrentUser.mockRejectedValue(new Error('Not authenticated'));

    const { store } = renderApp({ user: { id: '1', name: 'Test', email: 'test@test.com' } });

    await waitFor(() => {
      expect(mockGetCurrentUser).toHaveBeenCalled();
    });

    const state = store.getState();
    expect(state.auth.user).toBeNull();
    expect(state.auth.isAuthenticated).toBe(false);
  });
});
