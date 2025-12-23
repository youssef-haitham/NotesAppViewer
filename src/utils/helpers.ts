import { Colors } from '../types/note.types';

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export const getColorClass = (color: Colors): string => {
  const colorMap: Record<Colors, string> = {
    [Colors.YELLOW]: 'bg-note-yellow',
    [Colors.BLUE]: 'bg-note-blue',
    [Colors.GREY]: 'bg-note-grey',
  };
  return colorMap[color] || colorMap[Colors.YELLOW];
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

