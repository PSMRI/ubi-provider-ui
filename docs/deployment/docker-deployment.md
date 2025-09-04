# Docker Deployment Guide

## Prerequisites

- Docker installed
- Node.js and yarn (for local build)

## Project Structure

The deployment uses two key files:
- `Dockerfile`: Container configuration
- `nginx.conf`: Nginx server configuration with CORS and caching rules

## Dockerfile

Current project Dockerfile:
```dockerfile
FROM nginx:1.25.3
WORKDIR /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY . /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Build Process

1. Build the application locally:
   ```bash
   yarn install
   yarn build
   ```

2. Build Docker image:
   ```bash
   docker build -t benefits-provider-ui .
   ```

3. Run container:
   ```bash
   docker run -d -p 80:80 --name benefits-ui benefits-provider-ui
   ```

## Environment Configuration

1. Create `.env` file with required variables:
   - `VITE_PROVIDER_BASE_URL`
   - Other variables from environment-variables.md

2. Build with environment:
   ```bash
   docker run -d \
     -p 80:80 \
     --env-file .env \
     --name benefits-ui \
     benefits-provider-ui
   ```

## Nginx Configuration Features

The included `nginx.conf` provides:
- CORS configuration for API requests
- Static file caching (30 days for assets)
- No caching for HTML files
- Proxy header configuration
- Health check endpoint

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
   # Pull latest nginx base image
   docker pull nginx:1.25.3
   # Rebuild with no cache
   docker build --no-cache -t benefits-provider-ui .
   ```

## Health Check

The application can be checked at:
```bash
curl -I http://localhost:80/
```

Expected response: HTTP 200 OK