import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import SignupPage from './SignupPage';
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

const renderSignupPage = (initialAuthState?: any) => {
  const store = createMockStore(initialAuthState);
  return render(
    <Provider store={store}>
      <BrowserRouter>
        <SignupPage />
      </BrowserRouter>
    </Provider>
  );
};

describe('SignupPage', () => {
  it('should render signup page with title', () => {
    renderSignupPage();

    expect(screen.getByText(/create account/i)).toBeInTheDocument();
  });

  it('should render SignupForm component', () => {
    renderSignupPage();

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('should display error message when error exists', () => {
    const errorMessage = 'Email already exists';
    renderSignupPage({ error: errorMessage });

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('should not display error message when error is null', () => {
    renderSignupPage({ error: null });

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('should have correct page structure', () => {
    renderSignupPage();

    const heading = screen.getByRole('heading', { name: /create account/i });
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe('H2');
  });
});
