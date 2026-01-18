// src/components/AuthorizeView.tsx
import { useState, useEffect, createContext, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { userService } from '../services/UserService';

interface User {
    email: string;
    role: string;
}

interface AuthorizeViewProps {
    children: ReactNode;
}

export const UserContext = createContext<User | null>(null);

function AuthorizeView({ children }: AuthorizeViewProps) {
    const [authorized, setAuthorized] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                // Attempt to fetch user data from the server to verify authentication
                const response = await fetch('/Account/pingauth', {
                    method: 'GET',
                    credentials: 'include', // Include cookies if needed
                });

                if (response.status === 200) {
                    /*console.log("Authorized");*/
                    const data: User = await response.json();
                    setUser(data);
                    userService.saveUserData(data); // Ensure data is saved
                    setAuthorized(true);
                    /*console.log(data);*/
                } else if (response.status === 401) {
                    console.log("Unauthorized");
                    setAuthorized(false);
                } else {
                    throw new Error(`Unexpected status code: ${response.status}`);
                }
            } catch (error) {
                console.error('Authorization error:', error);
                setAuthorized(false);
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    return authorized && user ? (
        <UserContext.Provider value={user}>{children}</UserContext.Provider>
    ) : (
        <Navigate to="/login" />
    );
}

export default AuthorizeView;
