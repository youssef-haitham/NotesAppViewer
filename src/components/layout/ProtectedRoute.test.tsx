import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ProtectedRoute from './ProtectedRoute';
import authReducer from '../../store/slices/authSlice';

const createMockStore = (initialAuthState = {}) => {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
    preloadedState: {
      auth: {
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        ...initialAuthState,
      },
    },
  });
};

const renderWithProviders = (component: React.ReactElement, initialAuthState = {}) => {
  const store = createMockStore(initialAuthState);
  return render(
    <Provider store={store}>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </Provider>
  );
};

describe('ProtectedRoute', () => {
  it('should show loading message when isLoading is true', () => {
    renderWithProviders(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>,
      {
        isLoading: true,
      }
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('should redirect to login when user is not authenticated', () => {
    renderWithProviders(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>,
      {
        isLoading: false,
        isAuthenticated: false,
      }
    );

    // Should redirect to login, so protected content should not be visible
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    expect(window.location.pathname).toBe('/login');
  });

  it('should render children when user is authenticated', () => {
    renderWithProviders(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>,
      {
        isLoading: false,
        isAuthenticated: true,
        user: {
          id: '1',
          name: 'Test User',
          email: 'test@example.com',
        },
      }
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });
});

