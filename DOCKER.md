# Docker Setup

## Local Development

1. Create a `.env` file in the root directory:
```
VITE_API_BASE_URL=https://your-api-url.com
```

2. Run locally:
```bash
npm start
```

## Docker Build (for Railway)

Railway will automatically pass the `VITE_API_BASE_URL` service variable as an environment variable during build time. No additional configuration needed!

## Build and Run Docker Image Locally

```bash
# Build (VITE_API_BASE_URL from environment variable)
VITE_API_BASE_URL=https://your-api-url.com docker build -t notesapp-viewer .

# Run
docker run -p 3000:80 notesapp-viewer
```

Or using docker-compose:

```bash
docker-compose up --build
```

The app will be available at http://localhost:3000

## Environment Variables

- **Local**: Set `VITE_API_BASE_URL` in `.env` file
- **Railway**: Set `VITE_API_BASE_URL` as a service variable (automatically available during build)

## Notes

- Vite automatically exposes environment variables prefixed with `VITE_` to the client
- The VITE_API_BASE_URL is embedded at build time
- The app is served using nginx on port 80 inside the container
- Port mapping: Container port 80 → Host port 3000
- The nginx configuration supports React Router (SPA routing)
