# Docker Deployment Guide

## Prerequisites

- Docker installed
- Node.js and yarn (for local build)

## Project Structure

The deployment uses two key files:
- `Dockerfile`: Multi-stage build configuration
- `nginx.conf`: Nginx server configuration with CORS and caching rules

## Dockerfile

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

## Environment Configuration

1. Build-time Environment (Required):
   - Create `.env.production` with your VITE_* variables before building
   - These variables will be baked into the build:
   ```bash
   # Example .env.production
   VITE_PROVIDER_BASE_URL=https://api.example.com
   # Add other VITE_* variables
   ```

2. Runtime Environment (Optional Advanced Pattern):
   If you need to change environment variables without rebuilding:
   
   a. Create a runtime config file:
   ```javascript
   // public/env.js
   window.__ENV = {
     VITE_PROVIDER_BASE_URL: "https://api.example.com",
     // other runtime configs
   };
   ```
   
   b. Add to index.html:
   ```html
   <script src="/env.js"></script>
   ```
   
   c. Mount the config in container:
   ```bash
   docker run -d \
     -p 80:80 \
     -v $(pwd)/env.js:/usr/share/nginx/html/env.js \
     --name benefits-ui \
     benefits-provider-ui
   ```

   Note: Only use runtime config for non-sensitive values that need to change frequently.

3. Build Docker image:
   ```bash
   docker build -t benefits-provider-ui .
   ```

4. Run container:
   ```bash
   docker run -d -p 80:80 --name benefits-ui benefits-provider-ui
   ```

## Nginx Configuration

The nginx.conf must include:
```nginx
server {
    listen 80;
    
    # SPA routing fallback
    location / {
        try_files $uri /index.html;
        # CORS headers
        add_header 'Access-Control-Allow-Origin' '*';
        # ... other CORS headers
    }

    # Static file caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }

    # No caching for HTML
    location ~* \.html$ {
        expires -1;
        add_header Cache-Control "no-store, no-cache, must-revalidate";
    }

    # Health check
    location /health {
        access_log off;
        return 200 'OK';
        add_header Content-Type text/plain;
    }
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