import { getServerSession } from 'next-auth';
import { authOptions } from './auth-options';

export async function verifyToken() {
    try {
        // Get session from NextAuth
        const session = await getServerSession(authOptions);

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
        const session = await getServerSession(authOptions);

        return session?.user?.id || null;

    } catch (error) {
        console.error('Error getting user from session:', error);
        return null;
    }
}