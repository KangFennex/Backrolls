import { useState, useEffect } from 'react';
import { useBackrollsStore } from '../../store/backrollsStore';
import { ExtendedUser } from '../definitions';
import { useSession } from 'next-auth/react';

export function useAuth() {
    const [user, setUser] = useState<ExtendedUser | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { data: session, status } = useSession();

    const setCurrentUser = useBackrollsStore((state) => state.setCurrentUser);

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
            setCurrentUser(sessionUser.id || null);
        } else if (status === 'unauthenticated') {
            // No session - clear user state
            setUser(null);
            setIsAuthenticated(false);
            setCurrentUser(null);
            setIsLoading(false);
        }
    }, [session, status, setCurrentUser]);

    return {
        user,
        isAuthenticated,
        isLoading
    };
}