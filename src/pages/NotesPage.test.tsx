import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import NotesPage from './NotesPage';
import authReducer from '../store/slices/authSlice';
import notesReducer from '../store/slices/notesSlice';
import * as noteService from '../services/noteService';
import type { Note } from '../types/note.types';
import { Colors } from '../types/note.types';

// Mock noteService
jest.mock('../services/noteService');
const mockGetNotes = noteService.getNotes as jest.MockedFunction<typeof noteService.getNotes>;
const mockCreateNote = noteService.createNote as jest.MockedFunction<typeof noteService.createNote>;

const mockNotes: Note[] = [
  {
    id: '1',
    title: 'Test Note 1',
    content: 'Content 1',
    backgroundColor: Colors.YELLOW,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: '2',
    title: 'Test Note 2',
    content: 'Content 2',
    backgroundColor: Colors.BLUE,
    createdAt: '2024-01-02T00:00:00.000Z',
    updatedAt: '2024-01-02T00:00:00.000Z',
  },
];

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

const renderNotesPage = (initialState?: any) => {
  const store = createMockStore(initialState);
  return {
    ...render(
      <Provider store={store}>
        <BrowserRouter>
          <NotesPage />
        </BrowserRouter>
      </Provider>
    ),
    store,
  };
};

describe('NotesPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render notes page with title', () => {
    mockGetNotes.mockResolvedValue(mockNotes);
    renderNotesPage({ notes: mockNotes });

    expect(screen.getByText(/my notes/i)).toBeInTheDocument();
  });

  it('should render new note button', () => {
    mockGetNotes.mockResolvedValue(mockNotes);
    renderNotesPage({ notes: mockNotes });

    expect(screen.getByRole('button', { name: /new note/i })).toBeInTheDocument();
  });

  it('should load notes on mount', async () => {
    mockGetNotes.mockResolvedValue(mockNotes);

    renderNotesPage();

    await waitFor(() => {
      expect(mockGetNotes).toHaveBeenCalled();
    });
  });

  it('should display loading state', () => {
    renderNotesPage({ isLoading: true });

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('should display error message when error exists', () => {
    const errorMessage = 'Failed to load notes';
    renderNotesPage({ error: errorMessage, notes: [] });

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('should toggle note form when new note button is clicked', async () => {
    const user = userEvent.setup();
    mockGetNotes.mockResolvedValue(mockNotes);

    renderNotesPage({ notes: mockNotes });

    const newNoteButton = screen.getByRole('button', { name: /new note/i });
    await user.click(newNoteButton);

    expect(screen.getByText(/new note/i)).toBeInTheDocument();
    // There are two cancel buttons when form is shown - header and form. Check that at least one exists.
    const cancelButtons = screen.getAllByRole('button', { name: /cancel/i });
    expect(cancelButtons.length).toBeGreaterThan(0);
  });

  it('should show NoteForm when showForm is true', async () => {
    const user = userEvent.setup();
    mockGetNotes.mockResolvedValue(mockNotes);

    renderNotesPage({ notes: mockNotes });

    const newNoteButton = screen.getByRole('button', { name: /new note/i });
    await user.click(newNoteButton);

    await waitFor(() => {
      expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    });
    expect(screen.getByLabelText(/content/i)).toBeInTheDocument();
  });

  it('should hide NoteForm when cancel is clicked', async () => {
    const user = userEvent.setup();
    mockGetNotes.mockResolvedValue(mockNotes);

    renderNotesPage({ notes: mockNotes });

    const newNoteButton = screen.getByRole('button', { name: /new note/i });
    await user.click(newNoteButton);

    // There are two cancel buttons - one in header and one in form. Get the form one.
    const cancelButtons = screen.getAllByRole('button', { name: /cancel/i });
    const formCancelButton = cancelButtons.find(btn => btn.closest('form') !== null) || cancelButtons[1];
    await user.click(formCancelButton);

    await waitFor(() => {
      expect(screen.queryByLabelText(/title/i)).not.toBeInTheDocument();
    });
  });

  it('should render NoteList with notes', async () => {
    mockGetNotes.mockResolvedValue(mockNotes);
    renderNotesPage({ notes: mockNotes });

    await waitFor(() => {
      expect(screen.getByText('Test Note 1')).toBeInTheDocument();
    });
    expect(screen.getByText('Test Note 2')).toBeInTheDocument();
  });

  it('should create note when form is submitted', async () => {
    const user = userEvent.setup();
    const newNote: Note = {
      id: '3',
      title: 'New Note',
      content: 'New Content',
      backgroundColor: Colors.GREY,
      createdAt: '2024-01-03T00:00:00.000Z',
      updatedAt: '2024-01-03T00:00:00.000Z',
    };

    mockGetNotes.mockResolvedValue(mockNotes);
    mockCreateNote.mockResolvedValue(newNote);

    renderNotesPage({ notes: mockNotes });

    const newNoteButton = screen.getByRole('button', { name: /new note/i });
    await user.click(newNoteButton);

    const titleInput = screen.getByLabelText(/title/i);
    const contentInput = screen.getByLabelText(/content/i);

    await user.type(titleInput, 'New Note');
    await user.type(contentInput, 'New Content');

    const submitButton = screen.getByRole('button', { name: /save/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockCreateNote).toHaveBeenCalled();
    });
  });
});
