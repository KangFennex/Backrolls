import { useState, useEffect, useCallback } from 'react';
import { useBackrollsStore } from '../../store/backrollsStore';
import { ExtendedUser } from '../definitions';
import { useSession } from 'next-auth/react';

export function useAuth() {
    const [user, setUser] = useState<ExtendedUser | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { data: session, status } = useSession();

    // Get setCurrentUser outside of useEffect to avoid dependency issues
    const setCurrentUserRef = useBackrollsStore((state) => state.setCurrentUser);

    // Function to check auth from custom endpoint
    const checkCustomAuth = useCallback(async () => {
        try {
            const response = await fetch('/api/auth/verify', {
                credentials: 'include',
            });

            const result = await response.json();

            if (result.authenticated && result.user) {
                setUser(result.user);
                setIsAuthenticated(true);
                setCurrentUserRef(result.user.id);
            } else {
                setUser(null);
                setIsAuthenticated(false);
                setCurrentUserRef(null);
            }
        } catch (error) {
            setUser(null);
            setIsAuthenticated(false);
            setCurrentUserRef(null);
            console.error('Auth verification failed:', error);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Listen for NextAuth session changes
    useEffect(() => {
        setIsLoading(status === 'loading');

        if (status === 'authenticated' && session?.user) {
            // Session exists - update state
            const sessionUser = session.user as ExtendedUser;
            const extendedUser: ExtendedUser = {
                id: sessionUser.id,
                username: sessionUser.username || sessionUser.name || sessionUser.email?.split('@')[0],
                email: sessionUser.email,
                name: sessionUser.name,
                image: sessionUser.image
            };

            setUser(extendedUser);
            setIsAuthenticated(true);
            setCurrentUserRef(sessionUser.id || null);
        } else if (status === 'unauthenticated') {
            // No session - check custom auth as fallback
            checkCustomAuth();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session, status, checkCustomAuth]);

    // Initial auth check
    useEffect(() => {
        if (status === 'unauthenticated') {
            checkCustomAuth().finally(() => setIsLoading(false));
        }
    }, [status, checkCustomAuth]);

    return {
        user,
        isAuthenticated,
        isLoading
    };
}