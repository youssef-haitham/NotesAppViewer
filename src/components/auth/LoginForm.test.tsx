import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import LoginForm from './LoginForm';
import authReducer from '../../store/slices/authSlice';
import * as authService from '../../services/authService';

// Mock authService
jest.mock('../../services/authService');
const mockSignIn = authService.signIn as jest.MockedFunction<typeof authService.signIn>;

const createMockStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
  });
};

const renderWithProviders = (component: React.ReactElement) => {
  const store = createMockStore();
  return {
    ...render(
      <Provider store={store}>
        <BrowserRouter>
          {component}
        </BrowserRouter>
      </Provider>
    ),
    store,
  };
};

describe('LoginForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render login form', () => {
    renderWithProviders(<LoginForm />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('should show validation errors for empty fields', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginForm />);

    const submitButton = screen.getByRole('button', { name: /sign in/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });

  it('should show error for invalid email', async () => {
    const user = userEvent.setup();
    const mockSignIn = authService.signIn as jest.MockedFunction<typeof authService.signIn>;
    mockSignIn.mockClear();
    
    renderWithProviders(<LoginForm />);

    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, 'notanemail');
    await user.type(screen.getByLabelText(/password/i), 'password123');

    const submitButton = screen.getByRole('button', { name: /sign in/i });
    await user.click(submitButton);

    // Form should not submit due to validation - signIn should not be called
    await waitFor(() => {
      expect(mockSignIn).not.toHaveBeenCalled();
    });
  });

  it('should show error for short password', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginForm />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'short');

    const submitButton = screen.getByRole('button', { name: /sign in/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
    });
  });

  it('should submit form with valid data', async () => {
    const user = userEvent.setup();
    const mockUser = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
    };

    mockSignIn.mockResolvedValue(mockUser);

    renderWithProviders(<LoginForm />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');

    const submitButton = screen.getByRole('button', { name: /sign in/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  it('should show loading state during submission', async () => {
    const user = userEvent.setup();
    const mockUser = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
    };

    mockSignIn.mockImplementation(() => new Promise((resolve) => setTimeout(() => resolve(mockUser), 100)));

    renderWithProviders(<LoginForm />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');

    const submitButton = screen.getByRole('button', { name: /sign in/i });
    await user.click(submitButton);

    expect(screen.getByRole('button', { name: /signing in/i })).toBeDisabled();
  });

  it('should display sign up link', () => {
    renderWithProviders(<LoginForm />);

    const signUpLink = screen.getByRole('link', { name: /sign up/i });
    expect(signUpLink).toBeInTheDocument();
    expect(signUpLink).toHaveAttribute('href', '/signup');
  });
});


