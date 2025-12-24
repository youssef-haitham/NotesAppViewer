import { Link } from 'react-router-dom';
import type { Note } from '../../types/note.types';
import { getColorClass, truncateText, formatDate } from '../../utils/helpers';
import { ROUTES } from '../../utils/constants';

interface NoteCardProps {
  note: Note;
}

const NoteCard = ({ note }: NoteCardProps) => {
  return (
    <Link
      to={ROUTES.NOTE_DETAIL(note.id)}
      className={`block p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow ${getColorClass(note.backgroundColor)}`}
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {note.title}
      </h3>
      <p className="text-sm text-gray-700 mb-3">
        {truncateText(note.content, 100)}
      </p>
      <p className="text-xs text-gray-500">
        {formatDate(note.updatedAt)}
      </p>
    </Link>
  );
};

export default NoteCard;
