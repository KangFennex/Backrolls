import { inferAsyncReturnType } from '@trpc/server';
import { cookies } from 'next/headers';
import type { JWT } from 'next-auth/jwt';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { decode } = require('next-auth/jwt');

export async function createContext() {
    try {
        // Get the session cookie
        const cookieStore = await cookies();

        // Log all available cookies for debugging
        const allCookies = cookieStore.getAll();
        console.log('Available cookies:', allCookies.map(c => c.name));

        const sessionToken = cookieStore.get('authjs.session-token')
            || cookieStore.get('__Secure-authjs.session-token')
            || cookieStore.get('next-auth.session-token')
            || cookieStore.get('__Secure-next-auth.session-token');

        if (!sessionToken) {
            console.log('Context created - No session token found in cookies');
            return { session: null };
        }

        console.log('Found session token:', sessionToken.name);

        // Decode the JWT token
        const decoded = await decode({
            token: sessionToken.value,
            secret: process.env.AUTH_SECRET!,
        }) as JWT | null;

        console.log('Context created - Session exists:', !!decoded, 'User ID:', decoded?.id || decoded?.sub);

        return {
            session: decoded ? {
                user: {
                    id: (decoded.id || decoded.sub) as string,
                    email: decoded.email as string,
                    username: decoded.username as string,
                    name: decoded.username as string,
                }
            } : null,
        };
    } catch (error) {
        console.error('Error creating context:', error);
        return { session: null };
    }
}

export type Context = inferAsyncReturnType<typeof createContext>;