# Environment Variables

This document lists all environment variables required to run the Benefits Provider App UI.

## Configuration Variables

```env
# Base URL for provider API endpoints (no trailing slash)
VITE_PROVIDER_BASE_URL=<provider-api-base-url>

# Beckn App Platform identifier
VITE_BAP_ID=<bap-id>

# Beckn App Platform URI
VITE_BAP_URI=<bap-uri>

# Beckn Provider Platform identifier
VITE_BPP_ID=<bpp-id>

# Beckn Provider Platform URI
VITE_BPP_URI=<bpp-uri>

# Beneficiary application form iframe URL
VITE_BENEFICIERY_IFRAME_URL=<beneficiary-iframe-url>

# Benefit application form schema API endpoint
VITE_BENEFIT_SCHEMA_API=<benefit-schema-api-url>

# Provider catalog interface URL
VITE_PROVIDER_CATALOG_URL=<provider-catalog-url>

# Dashboard API URL (not in use, can be left empty)
VITE_APP_PROXY_API=
```

## Environment Types

The application supports different environment files:

1. `.env.development` - Development environment (used with `yarn dev`)
```env
VITE_PROVIDER_BASE_URL=<dev-provider-api-url>
VITE_BAP_ID=<dev-bap-id>
VITE_BAP_URI=<dev-bap-uri>
VITE_BPP_ID=<dev-bpp-id>
VITE_BPP_URI=<dev-bpp-uri>
VITE_BENEFICIERY_IFRAME_URL=<dev-beneficiary-url>
VITE_BENEFIT_SCHEMA_API=<dev-schema-api-url>
VITE_PROVIDER_CATALOG_URL=<dev-catalog-url>
VITE_APP_PROXY_API=
```

2. `.env.production` - Production environment (used with `yarn build`)
```env
VITE_PROVIDER_BASE_URL=<prod-provider-api-url>
VITE_BAP_ID=<prod-bap-id>
VITE_BAP_URI=<prod-bap-uri>
VITE_BPP_ID=<prod-bpp-id>
VITE_BPP_URI=<prod-bpp-uri>
VITE_BENEFICIERY_IFRAME_URL=<prod-beneficiary-url>
VITE_BENEFIT_SCHEMA_API=<prod-schema-api-url>
VITE_PROVIDER_CATALOG_URL=<prod-catalog-url>
VITE_APP_PROXY_API=
```

## Security Notes

1. **Environment File Handling**
   - Never commit `.env` files to version control
   - Use `.env.example` as a template
   - Keep production credentials secure

2. **Variable Exposure**
   - All `VITE_` prefixed variables are exposed to the client
   - Never store secrets in `VITE_` variables
   - Use backend environment variables for sensitive data

3. **Best Practices**
   - Rotate credentials regularly
   - Use different values for each environment
   - Validate environment variables on application startup