# Docker Setup

## Build the Docker image

```bash
docker build --build-arg BASEURL=https://your-api-url.com -t notesapp-viewer .
```

Or build without specifying BASEURL (will use empty string):

```bash
docker build -t notesapp-viewer .
```

## Run the container

```bash
docker run -p 3000:80 notesapp-viewer
```

The app will be available at http://localhost:3000

## Using Docker Compose

1. Create a `.env` file in the root directory:
```
BASEURL=https://your-api-url.com
```

2. Build and run:
```bash
docker-compose up --build
```

Or run in detached mode:
```bash
docker-compose up -d --build
```

3. To stop:
```bash
docker-compose down
```

## Environment Variables

- `BASEURL`: The API base URL (required at build time). This will be baked into the build.
  
  Example: `BASEURL=https://api.example.com`

## Notes

- The BASEURL is embedded at build time, not runtime
- The app is served using nginx on port 80 inside the container
- Port mapping: Container port 80 → Host port 3000 (change in docker-compose.yml if needed)
- The nginx configuration supports React Router (SPA routing)
