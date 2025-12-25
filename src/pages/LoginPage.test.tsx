import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import LoginPage from './LoginPage';
import authReducer from '../store/slices/authSlice';

const createMockStore = (initialAuthState?: any) => {
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

const renderLoginPage = (initialAuthState?: any) => {
  const store = createMockStore(initialAuthState);
  return render(
    <Provider store={store}>
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    </Provider>
  );
};

describe('LoginPage', () => {
  it('should render login page with title', () => {
    renderLoginPage();

    // Use getByRole to find the heading, not button text
    expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument();
  });

  it('should render LoginForm component', () => {
    renderLoginPage();

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('should display error message when error exists', () => {
    const errorMessage = 'Invalid credentials';
    renderLoginPage({ error: errorMessage });

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('should not display error message when error is null', () => {
    renderLoginPage({ error: null });

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('should have correct page structure', () => {
    renderLoginPage();

    const heading = screen.getByRole('heading', { name: /sign in/i });
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe('H2');
  });
});
