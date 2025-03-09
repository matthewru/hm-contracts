"use client";

import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@/components/ui/button";

export const Auth = () => {
    const {
        isAuthenticated,
        loginWithRedirect,
        logout,
        user,
        isLoading
    } = useAuth0();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            {!isAuthenticated ? (
                <Button 
                    onClick={() => loginWithRedirect()}
                    className="bg-blue-600 hover:bg-blue-700"
                >
                    Log In
                </Button>
            ) : (
                <div className="flex items-center gap-4">
                    <span>Welcome, {user?.name}</span>
                    <Button 
                        onClick={() => logout({ 
                            logoutParams: { 
                                returnTo: window.location.origin 
                            }
                        })}
                        variant="outline"
                    >
                        Log Out
                    </Button>
                </div>
            )}
        </div>
    );
};

export const useAuthGuard = () => {
    const { isAuthenticated, isLoading } = useAuth0();
    return { isAuthenticated, isLoading };
}; 