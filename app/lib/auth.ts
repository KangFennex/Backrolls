import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth-options';
import { ExtendedUser } from './definitions';

// Define a basic session type since NextAuth types aren't working properly
interface BasicSession {
    user?: {
        id?: string;
        email?: string | null;
        name?: string | null;
        username?: string | null;
        image?: string | null;
    };
}

export async function verifyToken() {
    try {
        // Get session from NextAuth
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const session = await getServerSession(authOptions as any) as BasicSession;

        if (session?.user) {
            const user = session.user as ExtendedUser;
            return {
                id: user.id,
                email: user.email,
                username: user.username
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
        const session = await getServerSession(authOptions as any) as BasicSession;
        const user = session?.user as ExtendedUser;

        return user?.id || null;

    } catch (error) {
        console.error('Error getting user from session:', error);
        return null;
    }
}