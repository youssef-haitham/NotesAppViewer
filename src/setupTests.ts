import '@testing-library/jest-dom';

// Mock constants module to avoid import.meta issues in Jest
// This path matches how constants is imported: '../utils/constants' from services, './utils/constants' from pages, etc.
jest.mock('./utils/constants', () => ({
  API_BASE_URL: 'http://localhost:3000',
  ROUTES: {
    LOGIN: '/login',
    SIGNUP: '/signup',
    NOTES: '/notes',
    NOTE_DETAIL: (id: string) => `/notes/${id}`,
  },
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
(globalThis as any).IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
} as any;

