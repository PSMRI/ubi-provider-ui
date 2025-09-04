# Development Setup Guide

## Development Environment Setup

### Prerequisites

1. Node.js v20
   ```bash
   # Using nvm (recommended)
   nvm install 20
   nvm use 20
   ```

2. Yarn package manager
   ```bash
   npm install -g yarn
   ```

3. Git
   - Download and install Git from [https://git-scm.com/downloads](https://git-scm.com/downloads)

### IDE Setup

Ensure your preferred IDE/editor has support for:
- ESLint integration
- Prettier formatting
- TypeScript language support
- JavaScript language support

### Project Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/PSMRI/benefits-provider-app-ui.git
   cd benefits-provider-app-ui
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your local configuration
   ```

4. Start development server:
   ```bash
   yarn dev
   ```

### Development Workflow

1. Create feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make changes and test locally

3. Run linting:
   ```bash
   yarn lint
   ```

4. Build and test:
   ```bash
   yarn build
   yarn preview
   ```

5. Commit changes:
   ```bash
   git add .
   git commit -m "feat: your feature description"
   ```

### Code Quality Tools

- ESLint for code linting
- TypeScript for type checking
- Husky for git hooks
- Prettier for code formatting

### Testing

Run tests using:
```bash
yarn test
```

### Debugging

1. Browser DevTools
   - React Developer Tools
   - Network tab for API calls
   - Console for logs

2. IDE Debugging
   - Use your IDE's built-in debugger
   - Configure source maps for breakpoint debugging
