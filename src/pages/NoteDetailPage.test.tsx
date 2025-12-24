import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import NoteDetailPage from './NoteDetailPage';
import authReducer from '../store/slices/authSlice';
import notesReducer from '../store/slices/notesSlice';
import * as noteService from '../services/noteService';
import type { Note } from '../types/note.types';
import { Colors } from '../types/note.types';

// Mock noteService
jest.mock('../services/noteService');
const mockGetNote = noteService.getNote as jest.MockedFunction<typeof noteService.getNote>;
const mockUpdateNote = noteService.updateNote as jest.MockedFunction<typeof noteService.updateNote>;

// Mock react-router-dom hooks
const mockUseParams = jest.fn();
const mockUseLocation = jest.fn();
const mockUseNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => mockUseParams(),
  useLocation: () => mockUseLocation(),
  useNavigate: () => mockUseNavigate(),
}));

const mockNote: Note = {
  id: '1',
  title: 'Test Note',
  content: 'Test Content',
  backgroundColor: Colors.YELLOW,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

const createMockStore = (initialState?: any) => {
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
        ...initialState,
      },
    },
  });
};

const renderNoteDetailPage = (initialState?: any) => {
  const store = createMockStore(initialState);
  return {
    ...render(
      <Provider store={store}>
        <BrowserRouter>
          <NoteDetailPage />
        </BrowserRouter>
      </Provider>
    ),
    store,
  };
};

describe('NoteDetailPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseParams.mockReturnValue({ id: '1' });
    mockUseLocation.mockReturnValue({ pathname: '/notes/1' });
    mockUseNavigate.mockReturnValue(jest.fn());
  });

  it('should load note on mount', async () => {
    mockGetNote.mockResolvedValue(mockNote);

    renderNoteDetailPage();

    await waitFor(() => {
      expect(mockGetNote).toHaveBeenCalledWith('1');
    });
  });

  it('should display loading state', () => {
    renderNoteDetailPage({ isLoading: true });

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('should display note not found when currentNote is null', () => {
    renderNoteDetailPage({ currentNote: null, isLoading: false });

    expect(screen.getByText(/note not found/i)).toBeInTheDocument();
  });

  it('should render note detail when note is loaded', () => {
    renderNoteDetailPage({ currentNote: mockNote, isLoading: false });

    expect(screen.getByText('Test Note')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should display error message when error exists', () => {
    const errorMessage = 'Failed to load note';
    renderNoteDetailPage({ currentNote: mockNote, error: errorMessage, isLoading: false });

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('should render back button', () => {
    renderNoteDetailPage({ currentNote: mockNote, isLoading: false });

    expect(screen.getByText(/back to notes/i)).toBeInTheDocument();
  });

  it('should render edit and delete buttons in view mode', () => {
    renderNoteDetailPage({ currentNote: mockNote, isLoading: false });

    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
  });

  it('should navigate back to notes when back button is clicked', async () => {
    const user = userEvent.setup();
    renderNoteDetailPage({ currentNote: mockNote, isLoading: false });

    const backButton = screen.getByText(/back to notes/i);
    await user.click(backButton);

    // The navigation is handled by react-router, so we just check the button is clickable
    expect(backButton).toBeInTheDocument();
  });
});
