'use client';

import { Auth0Provider } from "@auth0/auth0-react";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <Auth0Provider
      domain="dev-fkxbf8l30pt5tne7.us.auth0.com"
      clientId="7Jhfxewa8hHTJN2wjscv9TiOpf3rhMWi"
      authorizationParams={{
        redirect_uri: typeof window !== 'undefined' ? window.location.origin : ''
      }}
    >
      {children}
    </Auth0Provider>
  );
} 