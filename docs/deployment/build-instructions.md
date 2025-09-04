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

For all deployment configurations (Docker, AWS, and other environments), please refer to the deployment workflows in the `.github/workflows/` directory.
