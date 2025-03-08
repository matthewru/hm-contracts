'use client';

import { Auth0Provider } from "@auth0/auth0-react";
import { useRouter } from "next/navigation";
import React from "react";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const domain = "dev-fkxbf8l30pt5tne7.us.auth0.com";
  const clientId = "7Jhfxewa8hHTJN2wjscv9TiOpf3rhMWi";
  const redirectUri = typeof window !== 'undefined' ? window.location.origin : '';

  const onRedirectCallback = (appState: any) => {
    console.log("Auth0 redirect callback triggered", appState);
    router.push(appState?.returnTo || '/');
  };

  if (typeof window === 'undefined') {
    return <>{children}</>;
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: redirectUri,
        scope: "openid profile email"
      }}
      useRefreshTokens={true}
      cacheLocation="localstorage"
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  );
} 