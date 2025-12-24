import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setNotes, setLoading, setError, addNote } from '../store/slices/notesSlice';
import { getNotes, createNote } from '../services/noteService';
import NoteList from '../components/notes/NoteList';
import NoteForm from '../components/notes/NoteForm';
import Header from '../components/layout/Header';
import type { CreateNoteRequest } from '../types/note.types';

const NotesPage = () => {
  const dispatch = useAppDispatch();
  const { notes, isLoading, error } = useAppSelector((state) => state.notes);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    dispatch(setLoading(true));
    try {
      const fetchedNotes = await getNotes();
      dispatch(setNotes(fetchedNotes));
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch notes';
      dispatch(setError(errorMessage));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleCreateNote = async (data: CreateNoteRequest) => {
    setIsSubmitting(true);
    try {
      const newNote = await createNote(data);
      dispatch(addNote(newNote));
      setShowForm(false);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to create note';
      dispatch(setError(errorMessage));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Notes</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            {showForm ? 'Cancel' : 'New Note'}
          </button>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {showForm && (
          <div className="mb-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              New Note
            </h2>
            <NoteForm
              onSubmit={handleCreateNote}
              onCancel={() => setShowForm(false)}
              isSubmitting={isSubmitting}
            />
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">Loading...</p>
          </div>
        ) : (
          <NoteList notes={notes} />
        )}
      </main>
    </div>
  );
};

export default NotesPage;
