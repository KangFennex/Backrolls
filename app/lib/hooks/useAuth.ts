import { useState, useEffect, useCallback } from 'react';
import { useBackrollsStore } from '../../store/backrollsStore';
import { ExtendedUser } from '../definitions';
import { useSession } from 'next-auth/react';

export function useAuth() {
    const [user, setUser] = useState<ExtendedUser | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [dataLoaded, setDataLoaded] = useState(false); // Track if we've loaded user data
    const { data: session, status } = useSession();

    // Get store functions outside of useEffect to avoid dependency issues
    const setCurrentUserRef = useBackrollsStore((state) => state.setCurrentUser);
    const loadUserData = useBackrollsStore((state) => state.loadUserData);

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
                await setCurrentUserRef(result.user.id);
                
                // Load user data once after setting user
                if (!dataLoaded) {
                    await loadUserData();
                    setDataLoaded(true);
                }
            } else {
                setUser(null);
                setIsAuthenticated(false);
                await setCurrentUserRef(null);
                setDataLoaded(false);
            }
        } catch (error) {
            setUser(null);
            setIsAuthenticated(false);
            await setCurrentUserRef(null);
            setDataLoaded(false);
            console.error('Auth verification failed:', error);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dataLoaded]);

    // Listen for NextAuth session changes
    useEffect(() => {
        setIsLoading(status === 'loading');

        if (status === 'authenticated' && session?.user && !dataLoaded) {
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
            
            // Set user and load data once
            (async () => {
                await setCurrentUserRef(sessionUser.id || null);
                await loadUserData();
                setDataLoaded(true);
            })();
        } else if (status === 'unauthenticated') {
            // No session - check custom auth as fallback
            checkCustomAuth();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session, status, checkCustomAuth, dataLoaded]);

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