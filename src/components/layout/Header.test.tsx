import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Header from './Header';
import authReducer from '../../store/slices/authSlice';
import * as authService from '../../services/authService';

// Mock authService
jest.mock('../../services/authService');
const mockLogout = authService.logout as jest.MockedFunction<typeof authService.logout>;

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

describe('Header', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not render when user is not authenticated', () => {
    const { container } = renderWithProviders(<Header />);
    expect(container.firstChild).toBeNull();
  });

  it('should render when user is authenticated', () => {
    renderWithProviders(<Header />, {
      user: {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
      },
      isAuthenticated: true,
    });

    expect(screen.getByText('Notes App')).toBeInTheDocument();
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
  });

  it('should display user name', () => {
    renderWithProviders(<Header />, {
      user: {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
      },
      isAuthenticated: true,
    });

    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('should call logout when Logout button is clicked', async () => {
    const user = userEvent.setup();
    mockLogout.mockResolvedValue(undefined);

    renderWithProviders(<Header />, {
      user: {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
      },
      isAuthenticated: true,
    });

    const logoutButton = screen.getByRole('button', { name: /logout/i });
    await user.click(logoutButton);

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalledTimes(1);
    });
  });

  it('should have link to notes page', () => {
    renderWithProviders(<Header />, {
      user: {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
      },
      isAuthenticated: true,
    });

    const link = screen.getByRole('link', { name: /notes app/i });
    expect(link).toHaveAttribute('href', '/notes');
  });
});

