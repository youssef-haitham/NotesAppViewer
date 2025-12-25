# Notes App Viewer

A modern, full-featured notes management web application built with React, TypeScript, and Vite. This application allows users to create, view, edit, and delete notes with a clean and intuitive interface.

## Features

- 🔐 **User Authentication** - Secure sign up and login system
- 📝 **Create Notes** - Add new notes with title, content, and color customization
- 📋 **View Notes** - Browse all your notes in a responsive grid layout
- ✏️ **Edit Notes** - Update existing notes with an intuitive editing interface
- 🗑️ **Delete Notes** - Remove notes with confirmation
- 🎨 **Color Themes** - Choose from yellow, blue, or grey backgrounds for your notes
- 🌙 **Dark Mode** - Built-in dark mode support
- 🔒 **Protected Routes** - Secure routes that require authentication
- ✅ **Comprehensive Testing** - Full test coverage with Jest and React Testing Library

## Tech Stack

- **Frontend Framework:** React 18
- **Language:** TypeScript
- **Build Tool:** Vite
- **State Management:** Redux Toolkit
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **Form Handling:** React Hook Form
- **Styling:** Tailwind CSS
- **Testing:** Jest, React Testing Library
- **Animation:** Framer Motion

## Prerequisites

- Node.js 18.x or higher
- npm or yarn

## Getting Started

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd NotesAppViewer
```

2. Install dependencies:
```bash
npm install
```

### Environment Setup

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=https://your-api-url.com
```

Replace `https://your-api-url.com` with your actual API base URL.

### Development

Start the development server:

```bash
npm start
```

The application will be available at `http://localhost:3000`

### Build for Production

Build the application for production:

```bash
npm run build
```

The optimized production build will be in the `dist` directory.

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

## Testing

Run all tests:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Run tests with coverage:

```bash
npm run test:coverage
```

## Docker

### Local Development

1. Create a `.env` file:
```env
VITE_API_BASE_URL=https://your-api-url.com
```

2. Run locally:
```bash
npm start
```

### Docker Build

Build and run using Docker:

```bash
docker build -t notesapp-viewer .
docker run -p 3000:80 notesapp-viewer
```

For Railway deployment, set `VITE_API_BASE_URL` as a service variable - it will be automatically available during build time.

See [DOCKER.md](./DOCKER.md) for detailed Docker documentation.

## Project Structure

```
src/
├── components/          # React components
│   ├── auth/           # Authentication components
│   ├── layout/         # Layout components (Header, ProtectedRoute)
│   └── notes/          # Note-related components
├── pages/              # Page components
├── services/           # API services
├── store/              # Redux store and slices
├── types/              # TypeScript type definitions
└── utils/              # Utility functions and constants
```

## Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report

## CI/CD

This project includes GitHub Actions workflow (`.github/workflows/ci.yml`) that automatically runs unit tests on:
- Push to main, master, or develop branches
- Pull requests to main, master, or develop branches

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and proprietary.
