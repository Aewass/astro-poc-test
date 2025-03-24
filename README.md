# Astro POC Test

This is a proof-of-concept test project using Astro with Strapi CMS.

## Environment Variables

The project uses the following environment variables:

```env
PUBLIC_STRAPI_API_URL=https://strapi-poc-test.onrender.com/api
PUBLIC_STRAPI_DOMAIN=https://strapi-poc-test.onrender.com
PUBLIC_STRAPI_API_TOKEN=your_token_here
```

> **Note**: The current API token in the repository is for testing purposes only. In a production environment, you should:
>
> 1. Use a read-only token with minimal permissions
> 2. Keep the token secret and not commit it to the repository
> 3. Use environment variables in your deployment platform

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```
