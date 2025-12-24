import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import NoteCard from './NoteCard';
import { Colors } from '../../types/note.types';

const mockNote = {
  id: '1',
  title: 'Test Note',
  content: 'This is a test note content that should be displayed',
  backgroundColor: Colors.YELLOW,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('NoteCard', () => {
  it('should render note card with title', () => {
    renderWithRouter(<NoteCard note={mockNote} />);

    expect(screen.getByText('Test Note')).toBeInTheDocument();
  });

  it('should render note content', () => {
    renderWithRouter(<NoteCard note={mockNote} />);

    expect(screen.getByText(/this is a test note content/i)).toBeInTheDocument();
  });

  it('should render as a link to note detail page', () => {
    renderWithRouter(<NoteCard note={mockNote} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/notes/1');
  });

  it('should apply correct background color class', () => {
    const { container } = renderWithRouter(<NoteCard note={mockNote} />);

    const link = container.querySelector('a');
    expect(link).toHaveClass('bg-note-yellow');
  });

  it('should display formatted date', () => {
    renderWithRouter(<NoteCard note={mockNote} />);

    // The date should be formatted and displayed
    const dateElement = screen.getByText(/jan/i, { exact: false });
    expect(dateElement).toBeInTheDocument();
  });

  it('should truncate long content', () => {
    const longContentNote = {
      ...mockNote,
      content: 'a'.repeat(150),
    };

    renderWithRouter(<NoteCard note={longContentNote} />);

    const content = screen.getByText(/a+/);
    expect(content.textContent?.length).toBeLessThanOrEqual(103); // 100 + '...'
  });
});


