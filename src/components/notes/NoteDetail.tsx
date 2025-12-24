import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Note } from '../../types/note.types';
import { getColorClass, formatDate } from '../../utils/helpers';
import { ROUTES } from '../../utils/constants';
import { deleteNote } from '../../services/noteService';
import { useAppDispatch } from '../../store/hooks';
import { removeNote, setLoading, setError } from '../../store/slices/notesSlice';

interface NoteDetailProps {
  note: Note;
}

const NoteDetail = ({ note }: NoteDetailProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this note?')) {
      return;
    }

    setIsDeleting(true);
    dispatch(setLoading(true));

    try {
      await deleteNote(note.id);
      dispatch(removeNote(note.id));
      navigate(ROUTES.NOTES);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to delete note';
      dispatch(setError(errorMessage));
    } finally {
      setIsDeleting(false);
      dispatch(setLoading(false));
    }
  };

  return (
    <div className={`p-6 rounded-lg shadow-md ${getColorClass(note.backgroundColor)}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{note.title}</h1>
          <p className="text-sm text-gray-600">
            Created: {formatDate(note.createdAt)}
          </p>
          <p className="text-sm text-gray-600">
            Updated: {formatDate(note.updatedAt)}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`${ROUTES.NOTE_DETAIL(note.id)}/edit`)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
      <div className="prose max-w-none">
        <p className="text-gray-800 whitespace-pre-wrap">{note.content}</p>
      </div>
    </div>
  );
};

export default NoteDetail;
