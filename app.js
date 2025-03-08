import {useAuth0} from "@auth0/auth0-react";
import {useRouter} from "next/navigation";
import {useEffect} from "react";

const App = () => {
    const {isLoading, error, isAuthenticated, user, loginWithRedirect, logout} = useAuth0();
    const router = useRouter();

    // Redirect to main page when authentication is successful
    useEffect(() => {
        if (isAuthenticated) {
            router.push('/');  // This will redirect to page.tsx
        }
    }, [isAuthenticated, router]);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
        
    return (
        <div>
            {/* Your app content */}
        </div>
    );
}