# Docker Deployment Guide

## Prerequisites

- Docker installed
- Node.js and yarn (for local build)

## Project Structure

The deployment uses two key files:
- `Dockerfile`: Container configuration
- `nginx.conf`: Nginx server configuration with CORS and caching rules

## Dockerfile

Recommended multi-stage build:
```dockerfile
# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json yarn.lock ./
RUN corepack enable && yarn install --frozen-lockfile
COPY . .
RUN yarn build

# Production stage
FROM nginx:1.25.3
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/ /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Build Process

1. Configure environment:
   - Create `.env.production` with required VITE_* variables before building
   - These variables will be baked into the build

2. Build Docker image:
   ```bash
   docker build -t benefits-provider-ui .
   ```

3. Run container:
   ```bash
   docker run -d -p 80:80 --name benefits-ui benefits-provider-ui
   ```

## Nginx Configuration Requirements

The nginx.conf must include:
- SPA routing fallback: `try_files $uri /index.html;`
- CORS configuration for API requests
- Static file caching (30 days for assets)
- No caching for HTML files
- Proxy header configuration
- Health check endpoint

Example location block:
```nginx
location / {
    try_files $uri /index.html;
    # Other existing configurations...
}
```

## Production Guidelines

1. Resource Limits:
   ```bash
   docker run -d \
     -p 80:80 \
     --memory=512m \
     --cpus=0.5 \
     benefits-provider-ui
   ```

2. Logging:
   ```bash
   docker run -d \
     -p 80:80 \
     --log-driver=json-file \
     --log-opt max-size=10m \
     benefits-provider-ui
   ```

3. Security Updates:
   ```bash
   docker pull nginx:1.25.3
   docker build --no-cache -t benefits-provider-ui .
   ```