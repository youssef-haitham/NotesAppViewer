export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const ROUTES = {
  LOGIN: '/login',
  SIGNUP: '/signup',
  NOTES: '/notes',
  NOTE_DETAIL: (id: string) => `/notes/${id}`,
} as const;
