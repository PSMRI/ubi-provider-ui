# Environment Variables Configuration

## Required Environment Variables

| Variable | Description | Example Value |
|----------|-------------|---------------|
| VITE_PROVIDER_BASE_URL | Base URL for all API endpoints | `http://localhost:3000/api` |
| VITE_BAP_ID | Beckn App Platform ID | `benefits-bap` |
| VITE_BAP_URI | Beckn App Platform URI | `https://benefits-bap.example.com` |
| VITE_BPP_ID | Beckn Provider Platform ID | `benefits-bpp` |
| VITE_BPP_URI | Beckn Provider Platform URI | `https://benefits-bpp.example.com` |
| VITE_BENEFICIERY_IFRAME_URL | URL for beneficiary iframe integration | `https://beneficiary.example.com` |
| VITE_BENEFIT_SCHEMA_API | API endpoint for benefit schema | `https://schema.example.com` |

## Environment Types

The application supports different environment configurations:
- Development: Used when running `yarn dev`
- Production: Used when running the built application
- Test: Used for running tests

## Security Notes

Important: All variables prefixed with `VITE_` are exposed to the client in the browser. Never use VITE_ prefix for secrets or sensitive data!

- Never commit the `.env` file to version control
- Use `.env.example` as a template
- In production, use secure secrets management
- Regularly rotate sensitive tokens and credentials