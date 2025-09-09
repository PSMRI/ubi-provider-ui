# Build and Run Instructions

This guide explains how to build and run the Benefits Provider App UI.

## Running Locally

1. **Clone the Repository**
   ```bash
   git clone https://github.com/PSMRI/ubi-provider-ui.git
   cd ubi-provider-ui
   ```

2. **Install Dependencies**
   ```bash
   yarn install
   ```

3. **Set Up Environment**
   - Configure environment variables as specified in [Environment Variables](environment-variables.md)

4. **Start Development Server**
   ```bash
   yarn dev
   ```
   The application will be available at `http://localhost:5173`

5. **Build for Production**
   ```bash
   yarn build
   ```
   The build output will be in the `dist/` directory

6. **Preview Production Build**
   ```bash
   yarn preview
   ```

## Build Output Structure

The production build (`dist/` directory) contains:
- `index.html` - Entry point
- `assets/` - Optimized JavaScript, CSS, and other assets
- Static files (images, fonts, etc.)

## Common Issues and Solutions

1. **Port Already in Use**
   ```bash
   # Change port for development server
   VITE_PORT=3000 yarn dev
   ```

2. **Node Version Mismatch**
   ```bash
   # Use nvm to switch Node version
   nvm use 20
   ```

3. **Build Errors**
   - Clear node_modules: `rm -rf node_modules`
   - Clear yarn cache: `yarn cache clean`
   - Reinstall dependencies: `yarn install`