import api from './api';
import { getNotes, getNote, createNote, updateNote, deleteNote } from './noteService';
import type { Note, CreateNoteRequest, UpdateNoteRequest } from '../types/note.types';
import { Colors } from '../types/note.types';

// Mock api
jest.mock('./api');
const mockApi = api as jest.Mocked<typeof api>;

const mockNote: Note = {
  id: '1',
  title: 'Test Note',
  content: 'Test content',
  backgroundColor: Colors.YELLOW,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

describe('noteService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getNotes', () => {
    it('should call api.get with correct endpoint', async () => {
      const mockResponse: Note[] = [mockNote];

      mockApi.get.mockResolvedValue({ data: mockResponse } as any);

      const result = await getNotes();

      expect(mockApi.get).toHaveBeenCalledWith('/api/note');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getNote', () => {
    it('should call api.get with correct endpoint and id', async () => {
      mockApi.get.mockResolvedValue({ data: mockNote } as any);

      const result = await getNote('1');

      expect(mockApi.get).toHaveBeenCalledWith('/api/note/1');
      expect(result).toEqual(mockNote);
    });
  });

  describe('createNote', () => {
    it('should call api.post with correct endpoint and note data', async () => {
      const noteData: CreateNoteRequest = {
        title: 'New Note',
        content: 'New content',
        backgroundColor: Colors.BLUE,
      };

      mockApi.post.mockResolvedValue({ data: mockNote } as any);

      const result = await createNote(noteData);

      expect(mockApi.post).toHaveBeenCalledWith('/api/note', noteData);
      expect(result).toEqual(mockNote);
    });
  });

  describe('updateNote', () => {
    it('should call api.put with correct endpoint, id, and note data', async () => {
      const noteData: UpdateNoteRequest = {
        title: 'Updated Note',
        content: 'Updated content',
        backgroundColor: Colors.GREY,
      };

      const updatedNote = { ...mockNote, ...noteData };

      mockApi.put.mockResolvedValue({ data: updatedNote } as any);

      const result = await updateNote('1', noteData);

      expect(mockApi.put).toHaveBeenCalledWith('/api/note/1', noteData);
      expect(result).toEqual(updatedNote);
    });
  });

  describe('deleteNote', () => {
    it('should call api.delete with correct endpoint and id', async () => {
      mockApi.delete.mockResolvedValue({} as any);

      await deleteNote('1');

      expect(mockApi.delete).toHaveBeenCalledWith('/api/note/1');
    });
  });
});

