import { inferAsyncReturnType } from '@trpc/server';
import { getServerSession } from 'next-auth/next';
import type { Session } from 'next-auth';
import { authOptions } from '../lib/auth-options';

export async function createContext() {
    try {
        // Use getServerSession which properly handles cookie detection
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const session = await getServerSession(authOptions as any) as Session | null;

        if (!session?.user) {
            console.log('[Context] No session found');
            return { session: null };
        }

        console.log('[Context] Session found for user:', session.user.id);

        return {
            session: {
                user: {
                    id: session.user.id,
                    email: session.user.email || '',
                    username: session.user.username || session.user.name || '',
                    name: session.user.username || session.user.name || '',
                }
            },
        };
    } catch (error) {
        console.error('[Context] Error creating context:', error);
        return { session: null };
    }
}

export type Context = inferAsyncReturnType<typeof createContext>;