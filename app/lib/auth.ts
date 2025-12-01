import { getServerSession } from 'next-auth/next';
import type { Session } from 'next-auth';
import { authOptions } from './auth-options';

export async function verifyToken() {
    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const session = await getServerSession(authOptions as any) as Session | null;

        if (session?.user) {
            return {
                id: session.user.id,
                email: session.user.email,
                username: session.user.username
            };
        }

        return null;
    } catch (error) {
        console.error('Error verifying session:', error);
        return null;
    }
}

export async function getUserFromRequest(): Promise<string | null> {
    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const session = await getServerSession(authOptions as any) as Session | null;
        return session?.user?.id || null;
    } catch (error) {
        console.error('Error getting user from session:', error);
        return null;
    }
}