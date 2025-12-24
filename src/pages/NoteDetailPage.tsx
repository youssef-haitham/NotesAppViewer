import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setCurrentNote, setLoading, setError, updateNote } from '../store/slices/notesSlice';
import { getNote, updateNote as updateNoteService } from '../services/noteService';
import NoteDetail from '../components/notes/NoteDetail';
import NoteForm from '../components/notes/NoteForm';
import Header from '../components/layout/Header';
import type { UpdateNoteRequest } from '../types/note.types';
import { ROUTES } from '../utils/constants';

const NoteDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { currentNote, isLoading, error } = useAppSelector((state) => state.notes);
  const [isEditing, setIsEditing] = useState(location.pathname.endsWith('/edit'));
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      loadNote(id);
    }
  }, [id]);

  useEffect(() => {
    setIsEditing(location.pathname.endsWith('/edit'));
  }, [location.pathname]);

  const loadNote = async (noteId: string) => {
    dispatch(setLoading(true));
    try {
      const note = await getNote(noteId);
      dispatch(setCurrentNote(note));
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch note';
      dispatch(setError(errorMessage));
      navigate(ROUTES.NOTES);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleUpdateNote = async (data: UpdateNoteRequest) => {
    if (!id) return;

    setIsSubmitting(true);
    try {
      const updatedNote = await updateNoteService(id, data);
      dispatch(updateNote(updatedNote));
      setIsEditing(false);
      navigate(ROUTES.NOTE_DETAIL(id));
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update note';
      dispatch(setError(errorMessage));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">Loading...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!currentNote) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">Note not found</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate(ROUTES.NOTES)}
          className="mb-4 flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          <span>Back to Notes</span>
        </button>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {isEditing ? (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Edit Note
            </h2>
            <NoteForm
              initialData={currentNote}
              onSubmit={handleUpdateNote}
              onCancel={() => {
                setIsEditing(false);
                navigate(ROUTES.NOTE_DETAIL(id!));
              }}
              isSubmitting={isSubmitting}
            />
          </div>
        ) : (
          <NoteDetail note={currentNote} />
        )}
      </main>
    </div>
  );
};

export default NoteDetailPage;
