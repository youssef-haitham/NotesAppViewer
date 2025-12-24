// Read BaseURL from service variables (Railway BASEURL) or .env file
// 
// Locally (.env file):
//   BASEURL=https://your-api-url.com
//
// On Railway (service variables):
//   Variable name: BASEURL
//   Value: https://your-api-url.com
//
// vite.config.ts will automatically read BASEURL and make it available as VITE_BASE_URL

const getBaseURL = (): string => {
  // In test environment, use mock value
  if (process.env.NODE_ENV === 'test') {
    return (globalThis as any).__VITE_BASE_URL__ || 'http://localhost:3000';
  }
  // In runtime, use import.meta.env
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env.VITE_BASE_URL || '';
  }
  return '';
};

export const API_BASE_URL = getBaseURL();

if (!API_BASE_URL && process.env.NODE_ENV !== 'test') {
  throw new Error(
    'BASEURL is not set!\n\n' +
    'Please set BASEURL:\n' +
    '  - Local: Create .env file with "BASEURL=https://your-api-url.com"\n' +
    '  - Railway: Add service variable "BASEURL" with your API URL'
  );
}

export const ROUTES = {
  LOGIN: '/login',
  SIGNUP: '/signup',
  NOTES: '/notes',
  NOTE_DETAIL: (id: string) => `/notes/${id}`,
} as const;
