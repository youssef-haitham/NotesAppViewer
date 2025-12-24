import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import NoteList from './NoteList';
import type { Note } from '../../types/note.types';
import { Colors } from '../../types/note.types';

const mockNotes: Note[] = [
  {
    id: '1',
    title: 'Test Note 1',
    content: 'This is test content 1',
    backgroundColor: Colors.YELLOW,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: '2',
    title: 'Test Note 2',
    content: 'This is test content 2',
    backgroundColor: Colors.BLUE,
    createdAt: '2024-01-02T00:00:00.000Z',
    updatedAt: '2024-01-02T00:00:00.000Z',
  },
];

const renderNoteList = (notes: Note[]) => {
  return render(
    <BrowserRouter>
      <NoteList notes={notes} />
    </BrowserRouter>
  );
};

describe('NoteList', () => {
  it('should render empty state when notes array is empty', () => {
    renderNoteList([]);

    expect(screen.getByText(/no notes found/i)).toBeInTheDocument();
  });

  it('should render all notes', () => {
    renderNoteList(mockNotes);

    expect(screen.getByText('Test Note 1')).toBeInTheDocument();
    expect(screen.getByText('Test Note 2')).toBeInTheDocument();
    expect(screen.getByText(/this is test content 1/i)).toBeInTheDocument();
    expect(screen.getByText(/this is test content 2/i)).toBeInTheDocument();
  });

  it('should render correct number of note cards', () => {
    renderNoteList(mockNotes);

    const noteCards = screen.getAllByRole('link');
    expect(noteCards).toHaveLength(mockNotes.length);
  });

  it('should render single note correctly', () => {
    renderNoteList([mockNotes[0]]);

    expect(screen.getByText('Test Note 1')).toBeInTheDocument();
    expect(screen.queryByText('Test Note 2')).not.toBeInTheDocument();
  });
});
