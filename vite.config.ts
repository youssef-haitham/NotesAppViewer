import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'

// Load .env file manually for local development
// This reads BASEURL from .env file locally
dotenv.config()

// https://vite.dev/config/
export default defineConfig(() => {
  // Read BASEURL from:
  // 1. Railway service variable "BASEURL" (process.env.BASEURL) - available at build time
  // 2. Local .env file "BASEURL=..." - loaded by dotenv.config above
  // 3. Fallback to VITE_API_BASE_URL if BASEURL is not set
  const baseURL = process.env.BASEURL || process.env.VITE_API_BASE_URL || ''
  
  return {
    plugins: [react()],
    server: {
      port: 3000,
      strictPort: true,
    },
    define: {
      // Make BASEURL available in the app as import.meta.env.VITE_BASE_URL
      // This works both locally (from .env via dotenv) and on Railway (from service variables)
      'import.meta.env.VITE_BASE_URL': JSON.stringify(baseURL),
    },
  }
})
