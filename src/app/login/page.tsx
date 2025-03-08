'use client';

import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from 'next/link';

export default function LoginPage() {
  const { loginWithRedirect, isAuthenticated, isLoading, error } = useAuth0();
  const router = useRouter();
  const [loginAttempted, setLoginAttempted] = useState(false);

  // Debug logging
  console.log("Login page state:", { isAuthenticated, isLoading, error, loginAttempted });

  useEffect(() => {
    // Only redirect if authentication is complete and successful
    if (isAuthenticated && !isLoading) {
      console.log("User authenticated, redirecting to dashboard");
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleLogin = () => {
    console.log("Login button clicked");
    setLoginAttempted(true);
    loginWithRedirect({
      appState: { returnTo: '/' }
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-8">Contract Management App</h1>

      <div className="flex flex-col items-center gap-4">
        {isLoading ? (
          <div>Loading authentication...</div>
        ) : (
          <Button 
            onClick={handleLogin}
            className="w-64"
            disabled={loginAttempted && isLoading}
          >
            {loginAttempted && isLoading ? "Redirecting..." : "Login"}
          </Button>
        )}
        
        {error && (
          <div className="text-red-500 mt-4 p-4 border border-red-300 rounded bg-red-50">
            <p className="font-bold">Authentication Error:</p>
            <p>{error.message}</p>
          </div>
        )}
      </div>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-500">
          Don't have an account?{" "}
          <Link href="/signup" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
  
  