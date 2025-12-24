import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NoteForm from './NoteForm';
import { Colors } from '../../types/note.types';

const mockOnSubmit = jest.fn();
const mockOnCancel = jest.fn();

describe('NoteForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render form fields', () => {
    render(<NoteForm onSubmit={mockOnSubmit} />);

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/content/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/color/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
  });

  it('should show validation error for empty title', async () => {
    const user = userEvent.setup();
    render(<NoteForm onSubmit={mockOnSubmit} />);

    const submitButton = screen.getByRole('button', { name: /save/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument();
    });
  });

  it('should show validation error for long title', async () => {
    const user = userEvent.setup();
    render(<NoteForm onSubmit={mockOnSubmit} />);

    const titleInput = screen.getByLabelText(/title/i);
    await user.type(titleInput, 'a'.repeat(201));

    const submitButton = screen.getByRole('button', { name: /save/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/title must be at most 200 characters/i)).toBeInTheDocument();
    });
  });

  it('should show validation error for long content', async () => {
    const user = userEvent.setup();
    render(<NoteForm onSubmit={mockOnSubmit} />);

    const titleInput = screen.getByLabelText(/title/i);
    const contentInput = screen.getByLabelText(/content/i);

    await user.type(titleInput, 'Test Title');
    // Type a shorter string to avoid timeout
    await user.clear(contentInput);
    await user.paste('a'.repeat(5001));

    const submitButton = screen.getByRole('button', { name: /save/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/content must be at most 5000 characters/i)).toBeInTheDocument();
    }, { timeout: 10000 });
  });

  it('should submit form with valid data', async () => {
    const user = userEvent.setup();
    mockOnSubmit.mockResolvedValue(undefined);

    render(<NoteForm onSubmit={mockOnSubmit} />);

    const titleInput = screen.getByLabelText(/title/i);
    const contentInput = screen.getByLabelText(/content/i);

    await user.clear(titleInput);
    await user.type(titleInput, 'Test Note');
    await user.clear(contentInput);
    await user.type(contentInput, 'Test content');

    const submitButton = screen.getByRole('button', { name: /save/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Test Note',
          content: 'Test content',
          backgroundColor: Colors.YELLOW,
        })
      );
    });
  });

  it('should populate form with initial data', () => {
    const initialData = {
      title: 'Initial Title',
      content: 'Initial content',
      backgroundColor: Colors.BLUE,
    };

    render(<NoteForm initialData={initialData} onSubmit={mockOnSubmit} />);

    expect(screen.getByDisplayValue('Initial Title')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Initial content')).toBeInTheDocument();
    const select = screen.getByLabelText(/color/i) as HTMLSelectElement;
    expect(select.value).toBe(Colors.BLUE);
  });

  it('should call onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup();
    render(<NoteForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it('should not show cancel button when onCancel is not provided', () => {
    render(<NoteForm onSubmit={mockOnSubmit} />);

    expect(screen.queryByRole('button', { name: /cancel/i })).not.toBeInTheDocument();
  });

  it('should disable submit button when isSubmitting is true', () => {
    render(<NoteForm onSubmit={mockOnSubmit} isSubmitting={true} />);

    const submitButton = screen.getByRole('button', { name: /saving/i });
    expect(submitButton).toBeDisabled();
  });

  it('should show "Saving..." text when isSubmitting is true', () => {
    render(<NoteForm onSubmit={mockOnSubmit} isSubmitting={true} />);

    expect(screen.getByText(/saving/i)).toBeInTheDocument();
  });
});

