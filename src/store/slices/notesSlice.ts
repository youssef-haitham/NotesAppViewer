import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Note } from '../../types/note.types';

interface NotesState {
  notes: Note[];
  currentNote: Note | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: NotesState = {
  notes: [],
  currentNote: null,
  isLoading: false,
  error: null,
};

const notesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentNote: (state) => {
      state.currentNote = null;
    },
    resetNotes: (state) => {
      state.notes = [];
      state.currentNote = null;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setNotes: (state, action: PayloadAction<Note[]>) => {
      state.notes = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setCurrentNote: (state, action: PayloadAction<Note>) => {
      state.currentNote = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    addNote: (state, action: PayloadAction<Note>) => {
      state.notes.unshift(action.payload);
      state.isLoading = false;
      state.error = null;
    },
    updateNote: (state, action: PayloadAction<Note>) => {
      const index = state.notes.findIndex((note) => note.id === action.payload.id);
      if (index !== -1) {
        state.notes[index] = action.payload;
      }
      if (state.currentNote?.id === action.payload.id) {
        state.currentNote = action.payload;
      }
      state.isLoading = false;
      state.error = null;
    },
    removeNote: (state, action: PayloadAction<string>) => {
      state.notes = state.notes.filter((note) => note.id !== action.payload);
      if (state.currentNote?.id === action.payload) {
        state.currentNote = null;
      }
      state.isLoading = false;
      state.error = null;
    },
  },
});

export const {
  clearError,
  clearCurrentNote,
  resetNotes,
  setLoading,
  setError,
  setNotes,
  setCurrentNote,
  addNote,
  updateNote,
  removeNote,
} = notesSlice.actions;
export default notesSlice.reducer;
