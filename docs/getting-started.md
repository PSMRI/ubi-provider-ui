# Getting Started

This guide will help you set up and run the UBI Provider UI application.

## Quick Start

1. Install prerequisites:
   - Node.js v20
   - Yarn package manager
   - Git

2. Clone the repository:
   ```bash
   git clone https://github.com/PSMRI/ubi-provider-ui.git
   cd ubi-provider-ui
   ```

3. Install dependencies:
   ```bash
   yarn install
   ```

4. Set up environment:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. Start development server:
   ```bash
   yarn dev
   ```

## Next Steps

- Read the [Development Guide](development/setup.md) for detailed setup
- Check [Environment Variables](configuration/environment-variables.md) for configuration
- See [API Integration](api/integration-guide.md) for backend communication
- Review [Deployment Guides](deployment/build-instructions.md) for production setup

## Available Scripts

- `yarn dev`: Start development server
- `yarn build`: Build for production
- `yarn preview`: Preview production build

## Documentation Structure

- `/docs/development`: Development guides and standards
- `/docs/deployment`: Deployment and build instructions
- `/docs/configuration`: Environment and app configuration
- `/docs/api`: API integration documentation