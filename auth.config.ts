import Credentials from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

// Define the configuration type since NextAuth v4 types aren't resolving properly
interface AuthConfig {
    pages?: {
        signIn?: string;
        [key: string]: string | undefined;
    };
    callbacks?: {
        jwt?: (params: { token: Record<string, unknown>; user?: Record<string, unknown>; account?: Record<string, unknown> }) => Record<string, unknown> | Promise<Record<string, unknown>>;
        session?: (params: { session: Record<string, unknown>; token?: Record<string, unknown> }) => Record<string, unknown> | Promise<Record<string, unknown>>;
    };
    providers: unknown[];  // Back to unknown[] to be more flexible
    session?: {
        strategy?: 'jwt' | 'database';
        maxAge?: number;
    };
}

export const authConfig: AuthConfig = {
    pages: {
        signIn: '/login',
    },
    callbacks: {
        async jwt({ token, user, account }: { token: Record<string, unknown>; user?: Record<string, unknown>; account?: Record<string, unknown> }) {
            if (user) {
                token.id = user.id;
            }
            if (account?.provider === 'google') {
                // Handle Google user data here
            }
            return token;
        },
        async session({ session, token }: { session: Record<string, unknown>; token?: Record<string, unknown> }) {
            if (token?.id) {
                const sessionWithUser = session as { user: { id?: string; [key: string]: unknown } };
                sessionWithUser.user.id = token.id as string;
            }
            return session;
        },
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID!,
            clientSecret: process.env.GOOGLE_SECRET!,
        }),
        Credentials({
            name: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'email ' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize() {
                // This will be handled in auth.ts
                return null;
            },
        }),
    ] as unknown[],
    session: {
        strategy: 'jwt' as const,
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
};