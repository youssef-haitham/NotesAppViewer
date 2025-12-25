# ===============================
# Stage 1: Build React app
# ===============================
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build-time env variable (Railway provides it)
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

# Build the app
RUN npm run build


# ===============================
# Stage 2: Serve with Nginx
# ===============================
FROM nginx:alpine

# Copy built files
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx template (IMPORTANT)
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Railway provides PORT env var
EXPOSE 3000

# Replace PORT at runtime then start nginx
CMD ["/bin/sh", "-c", "envsubst '$PORT' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]