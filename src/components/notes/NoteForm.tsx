import { useForm } from 'react-hook-form';
import type { CreateNoteRequest, UpdateNoteRequest } from '../../types/note.types';
import { Colors } from '../../types/note.types';

interface NoteFormProps {
  initialData?: UpdateNoteRequest;
  onSubmit: (data: CreateNoteRequest | UpdateNoteRequest) => Promise<void>;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

const NoteForm = ({ initialData, onSubmit, onCancel, isSubmitting = false }: NoteFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateNoteRequest>({
    defaultValues: initialData,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Title
        </label>
        <input
          id="title"
          type="text"
          {...register('title', {
            required: 'Title is required',
            minLength: {
              value: 1,
              message: 'Title must be at least 1 character',
            },
            maxLength: {
              value: 200,
              message: 'Title must be at most 200 characters',
            },
          })}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Content
        </label>
        <textarea
          id="content"
          rows={6}
          {...register('content', {
            maxLength: {
              value: 5000,
              message: 'Content must be at most 5000 characters',
            },
          })}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        {errors.content && (
          <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="backgroundColor" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Color
        </label>
        <select
          id="backgroundColor"
          {...register('backgroundColor')}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value={Colors.YELLOW}>Yellow</option>
          <option value={Colors.BLUE}>Blue</option>
          <option value={Colors.GREY}>Grey</option>
        </select>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Saving...' : 'Save'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default NoteForm;
