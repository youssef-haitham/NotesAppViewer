import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import NoteDetail from './NoteDetail';
import notesReducer from '../../store/slices/notesSlice';
import authReducer from '../../store/slices/authSlice';
import * as noteService from '../../services/noteService';
import { Colors } from '../../types/note.types';

// Mock noteService
jest.mock('../../services/noteService');
const mockDeleteNote = noteService.deleteNote as jest.MockedFunction<typeof noteService.deleteNote>;

// Mock window.confirm
const mockConfirm = jest.fn();
window.confirm = mockConfirm;

const mockNote = {
  id: '1',
  title: 'Test Note',
  content: 'Test content',
  backgroundColor: Colors.YELLOW,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

const createMockStore = () => {
  return configureStore({
    reducer: {
      notes: notesReducer,
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

describe('NoteDetail', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockConfirm.mockReturnValue(true);
  });

  it('should render note details', () => {
    renderWithProviders(<NoteDetail note={mockNote} />);

    expect(screen.getByText('Test Note')).toBeInTheDocument();
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('should display formatted dates', () => {
    renderWithProviders(<NoteDetail note={mockNote} />);

    expect(screen.getByText(/created:/i)).toBeInTheDocument();
    expect(screen.getByText(/updated:/i)).toBeInTheDocument();
  });

  it('should render Edit and Delete buttons', () => {
    renderWithProviders(<NoteDetail note={mockNote} />);

    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
  });

  it('should navigate to edit page when Edit button is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<NoteDetail note={mockNote} />);

    const editButton = screen.getByRole('button', { name: /edit/i });
    await user.click(editButton);

    // Check if navigation happened (URL should change)
    expect(window.location.pathname).toBe('/notes/1/edit');
  });

  it('should not delete note if user cancels confirmation', async () => {
    const user = userEvent.setup();
    mockConfirm.mockReturnValue(false);

    renderWithProviders(<NoteDetail note={mockNote} />);

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    await user.click(deleteButton);

    expect(mockDeleteNote).not.toHaveBeenCalled();
  });

  it('should delete note when Delete button is clicked and confirmed', async () => {
    const user = userEvent.setup();
    mockDeleteNote.mockResolvedValue(undefined);

    renderWithProviders(<NoteDetail note={mockNote} />);

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    await user.click(deleteButton);

    await waitFor(() => {
      expect(mockDeleteNote).toHaveBeenCalledWith('1');
    });
  });

  it('should show "Deleting..." text when deleting', async () => {
    const user = userEvent.setup();
    mockDeleteNote.mockImplementation(() => new Promise((resolve) => setTimeout(() => resolve(), 100)));

    renderWithProviders(<NoteDetail note={mockNote} />);

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    await user.click(deleteButton);

    await waitFor(() => {
      expect(screen.getByText(/deleting/i)).toBeInTheDocument();
    });
  });

  it('should disable delete button when deleting', async () => {
    const user = userEvent.setup();
    mockDeleteNote.mockImplementation(() => new Promise((resolve) => setTimeout(() => resolve(), 100)));

    renderWithProviders(<NoteDetail note={mockNote} />);

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    await user.click(deleteButton);

    await waitFor(() => {
      expect(deleteButton).toBeDisabled();
    });
  });
});

