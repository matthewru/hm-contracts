/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  env: {
    NEXT_PUBLIC_AUTH0_DOMAIN: process.env.AUTH0_ISSUER_BASE_URL?.replace('https://', '') || 'dev-fkxbf8l30pt5tne7.us.auth0.com',
    NEXT_PUBLIC_AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID || '7Jhfxewa8hHTJN2wjscv9TiOpf3rhMWi',
    NEXT_PUBLIC_AUTH0_AUDIENCE: process.env.AUTH0_AUDIENCE || 'https://dev-fkxbf8l30pt5tne7.us.auth0.com/api/v2/',
    NEXT_PUBLIC_AUTH0_SCOPE: process.env.AUTH0_SCOPE || 'openid profile email',
    NEXT_PUBLIC_API_URL: process.env.AUTH0_BASE_URL ? `${process.env.AUTH0_BASE_URL}/api` : 'http://localhost:3000/api'
  }
};

module.exports = nextConfig; 