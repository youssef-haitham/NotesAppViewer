import notesReducer, {
  addNote,
  clearCurrentNote,
  clearError,
  removeNote,
  resetNotes,
  setCurrentNote,
  setError,
  setLoading,
  setNotes,
  updateNote,
} from '../notesSlice';
import type { Note } from '../../../types/note.types';
import { Colors } from '../../../types/note.types';

const mockNote: Note = {
  id: '1',
  title: 'Test Note',
  content: 'Test content',
  backgroundColor: Colors.YELLOW,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

describe('notesSlice', () => {
  const initialState = {
    notes: [],
    currentNote: null,
    isLoading: false,
    error: null,
  };

  it('should return initial state', () => {
    expect(notesReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('setNotes', () => {
    it('should set notes array', () => {
      const notes = [mockNote];
      const action = setNotes(notes);
      const state = notesReducer(initialState, action);

      expect(state.notes).toEqual(notes);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });
  });

  describe('addNote', () => {
    it('should add note to the beginning of array', () => {
      const action = addNote(mockNote);
      const state = notesReducer(initialState, action);

      expect(state.notes).toHaveLength(1);
      expect(state.notes[0]).toEqual(mockNote);
    });
  });

  describe('updateNote', () => {
    it('should update existing note', () => {
      const stateWithNote = {
        ...initialState,
        notes: [mockNote],
      };
      const updatedNote = { ...mockNote, title: 'Updated Title' };
      const action = updateNote(updatedNote);
      const state = notesReducer(stateWithNote, action);

      expect(state.notes[0].title).toBe('Updated Title');
    });

    it('should update currentNote if it matches', () => {
      const stateWithCurrentNote = {
        ...initialState,
        notes: [mockNote],
        currentNote: mockNote,
      };
      const updatedNote = { ...mockNote, title: 'Updated Title' };
      const action = updateNote(updatedNote);
      const state = notesReducer(stateWithCurrentNote, action);

      expect(state.currentNote?.title).toBe('Updated Title');
    });
  });

  describe('removeNote', () => {
    it('should remove note by id', () => {
      const stateWithNotes = {
        ...initialState,
        notes: [mockNote],
      };
      const action = removeNote('1');
      const state = notesReducer(stateWithNotes, action);

      expect(state.notes).toHaveLength(0);
    });

    it('should clear currentNote if it matches removed note', () => {
      const stateWithCurrentNote = {
        ...initialState,
        notes: [mockNote],
        currentNote: mockNote,
      };
      const action = removeNote('1');
      const state = notesReducer(stateWithCurrentNote, action);

      expect(state.currentNote).toBeNull();
    });
  });

  describe('setCurrentNote', () => {
    it('should set current note', () => {
      const action = setCurrentNote(mockNote);
      const state = notesReducer(initialState, action);

      expect(state.currentNote).toEqual(mockNote);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });
  });

  describe('clearCurrentNote', () => {
    it('should clear current note', () => {
      const stateWithCurrentNote = {
        ...initialState,
        currentNote: mockNote,
      };
      const action = clearCurrentNote();
      const state = notesReducer(stateWithCurrentNote, action);

      expect(state.currentNote).toBeNull();
    });
  });

  describe('setLoading', () => {
    it('should set loading state', () => {
      const action = setLoading(true);
      const state = notesReducer(initialState, action);

      expect(state.isLoading).toBe(true);
    });
  });

  describe('setError', () => {
    it('should set error message', () => {
      const errorMessage = 'Test error';
      const action = setError(errorMessage);
      const state = notesReducer(initialState, action);

      expect(state.error).toBe(errorMessage);
    });
  });

  describe('clearError', () => {
    it('should clear error', () => {
      const stateWithError = {
        ...initialState,
        error: 'Test error',
      };
      const action = clearError();
      const state = notesReducer(stateWithError, action);

      expect(state.error).toBeNull();
    });
  });

  describe('resetNotes', () => {
    it('should reset notes state', () => {
      const stateWithData = {
        notes: [mockNote],
        currentNote: mockNote,
        isLoading: true,
        error: 'Some error',
      };
      const action = resetNotes();
      const state = notesReducer(stateWithData, action);

      expect(state.notes).toEqual([]);
      expect(state.currentNote).toBeNull();
      expect(state.error).toBeNull();
    });
  });
});

