# Getting Started

## Prerequisites

- Node.js v20
- Yarn package manager
- Git

## Quick Start

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
   - Copy `.env.example` to `.env`
   - Update the variables (see [Environment Variables](configuration/environment-variables.md))

4. Start development server:
   ```bash
   yarn dev
   ```

## Development Environment

The application uses:
- React 18
- TypeScript
- Vite
- Chakra UI
- React Router DOM
- i18next for internationalization

## Available Scripts

- `yarn dev` - Start development server
- `yarn build` - Create production build
- `yarn preview` - Preview production build
- `yarn lint` - Run ESLint
- `yarn clean:vite` - Clean Vite cache

## Next Steps
- Set up your [Development Environment](development/setup.md)
- Learn about [Deployment Options](deployment/build-instructions.md)
