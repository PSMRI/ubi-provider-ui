# API Integration Guide

## Overview

The Benefits Provider App UI integrates with backend services through RESTful APIs. This guide provides an overview of the available endpoints and their purposes.

## API Endpoints

All endpoints use the same base URL: `VITE_PROVIDER_BASE_URL`

### Authentication
- POST `/auth/login`
  - Purpose: Authenticate user with email and password
  - Returns: Authentication token and basic user information

### Benefits Management
- POST `/benefits/search`
  - Purpose: Search and filter benefits with optional parameters
  - Returns: List of benefits with pagination

- GET `/benefits/getById/:benefitId`
  - Purpose: Retrieve detailed information about a specific benefit
  - Parameter: `benefitId` - Unique identifier of the benefit

### Applications Management
- GET `/applications?benefitId=:benefitId`
  - Purpose: List all applications for a specific benefit
  - Parameter: `benefitId` - Filter applications by benefit

- GET `/applications/:applicationId`
  - Purpose: Get detailed information about a specific application
  - Parameter: `applicationId` - Unique identifier of the application

- GET `/applications/check-eligibility/:applicationId`
  - Purpose: Check if an application meets eligibility criteria
  - Parameters: 
    - `applicationId` - Application to check
    - `strictCheck` (query) - Enable/disable strict validation

- PATCH `/applications/:applicationId/status`
  - Purpose: Update the status of an application
  - Parameter: `applicationId` - Application to update
  - Required fields: status and remark

### Admin Management
- GET `/strapi-admin/roles`
  - Purpose: List all available roles
  - Access: Admin only

- GET `/strapi-admin/users`
  - Purpose: List all provider users
  - Access: Admin only

## Authentication

The application uses token-based authentication:

```typescript
// API Client Configuration
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_PROVIDER_BASE_URL
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

## Error Handling

All API endpoints follow a standard error response format:
- HTTP status codes indicate the type of error
- Error responses include a message explaining the error
- Additional details may be provided for debugging (in development)

Example error handling:
```typescript
try {
  const response = await apiClient.get('/benefits/search');
  return response.data;
} catch (error) {
  if (error.response) {
    // Handle API error
    console.error('API Error:', error.response.data);
  } else if (error.request) {
    // Handle network error
    console.error('Network Error:', error.message);
  }
  throw error;
}
```

## Security Considerations

1. Always use HTTPS for API communication
2. Implement secure session management and token handling
3. Validate all inputs and handle errors appropriately
4. Keep dependencies updated for security patches