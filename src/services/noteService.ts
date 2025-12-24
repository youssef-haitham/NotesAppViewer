import api from './api';
import type { Note, CreateNoteRequest, UpdateNoteRequest } from '../types/note.types';

export const getNotes = async (): Promise<Note[]> => {
  const response = await api.get<Note[]>('/api/note');
  return response.data;
};

export const getNote = async (id: string): Promise<Note> => {
  const response = await api.get<Note>(`/api/note/${id}`);
  return response.data;
};

export const createNote = async (noteData: CreateNoteRequest): Promise<Note> => {
  const response = await api.post<Note>('/api/note', noteData);
  return response.data;
};

export const updateNote = async (id: string, noteData: UpdateNoteRequest): Promise<Note> => {
  const response = await api.put<Note>(`/api/note/${id}`, noteData);
  return response.data;
};

export const deleteNote = async (id: string): Promise<void> => {
  await api.delete(`/api/note/${id}`);
};
