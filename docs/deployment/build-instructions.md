# Build Instructions

## Production Build

1. Create production build:
   ```bash
   yarn build
   ```

2. The build output will be in the `dist/` directory

## Build Configuration

The build process uses Vite and includes:
- TypeScript compilation
- Asset optimization
- Bundle size optimization
- Environment variable injection

## Build Output

The `dist/` directory will contain:
- HTML entry point
- JavaScript bundles
- CSS bundles
- Static assets
- Source maps (if enabled)

## Deployment Options

See detailed guides for:
- [AWS Deployment](aws-deployment.md)
- [Docker Deployment](docker-deployment.md)
