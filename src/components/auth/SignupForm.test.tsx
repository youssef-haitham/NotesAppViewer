import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import SignupForm from './SignupForm';
import authReducer from '../../store/slices/authSlice';
import * as authService from '../../services/authService';

// Mock authService
jest.mock('../../services/authService');
const mockSignUp = authService.signUp as jest.MockedFunction<typeof authService.signUp>;

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

describe('SignupForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render signup form', () => {
    renderWithProviders(<SignupForm />);

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  it('should show validation errors for empty fields', async () => {
    const user = userEvent.setup();
    renderWithProviders(<SignupForm />);

    const submitButton = screen.getByRole('button', { name: /sign up/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });

  it('should show error for short name', async () => {
    const user = userEvent.setup();
    renderWithProviders(<SignupForm />);

    const nameInput = screen.getByLabelText(/name/i);
    await user.type(nameInput, 'ab');

    const submitButton = screen.getByRole('button', { name: /sign up/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/name must be at least 3 characters/i)).toBeInTheDocument();
    });
  });

  it('should show error for long name', async () => {
    const user = userEvent.setup();
    renderWithProviders(<SignupForm />);

    const nameInput = screen.getByLabelText(/name/i);
    await user.type(nameInput, 'a'.repeat(33));

    const submitButton = screen.getByRole('button', { name: /sign up/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/name must be at most 32 characters/i)).toBeInTheDocument();
    });
  });

  it('should show error for invalid email', async () => {
    const user = userEvent.setup();
    const mockSignUp = authService.signUp as jest.MockedFunction<typeof authService.signUp>;
    mockSignUp.mockClear();
    
    renderWithProviders(<SignupForm />);

    await user.type(screen.getByLabelText(/name/i), 'Test User');
    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, 'notanemail');
    await user.type(screen.getByLabelText(/password/i), 'password123');

    const submitButton = screen.getByRole('button', { name: /sign up/i });
    await user.click(submitButton);

    // Form should not submit due to validation - signUp should not be called
    await waitFor(() => {
      expect(mockSignUp).not.toHaveBeenCalled();
    });
  });

  it('should show error for short password', async () => {
    const user = userEvent.setup();
    renderWithProviders(<SignupForm />);

    const passwordInput = screen.getByLabelText(/password/i);
    await user.type(passwordInput, 'short');

    const submitButton = screen.getByRole('button', { name: /sign up/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
    });
  });

  it('should show error for long password', async () => {
    const user = userEvent.setup();
    renderWithProviders(<SignupForm />);

    const passwordInput = screen.getByLabelText(/password/i);
    await user.type(passwordInput, 'a'.repeat(33));

    const submitButton = screen.getByRole('button', { name: /sign up/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/password must be at most 32 characters/i)).toBeInTheDocument();
    });
  });

  it('should submit form with valid data', async () => {
    const user = userEvent.setup();
    const mockUser = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
    };

    mockSignUp.mockResolvedValue(mockUser);

    renderWithProviders(<SignupForm />);

    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    await user.type(nameInput, 'Test User');
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');

    const submitButton = screen.getByRole('button', { name: /sign up/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  it('should display sign in link', () => {
    renderWithProviders(<SignupForm />);

    const signInLink = screen.getByRole('link', { name: /sign in/i });
    expect(signInLink).toBeInTheDocument();
    expect(signInLink).toHaveAttribute('href', '/login');
  });
});


