import Credentials from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import type { NextAuthOptions } from 'next-auth';

export const authConfig: NextAuthOptions = {
    pages: {
        signIn: '/login',
    },
    callbacks: {
        async jwt({ token, user, account }: { token: any; user?: any; account?: any }) {
            if (user) {
                token.id = user.id;
            }
            if (account?.provider === 'google') {
                // Handle Google user data here
            }
            return token;
        },
        async session({ session, token }: { session: any; token?: any }) {
            if (token?.id) {
                session.user.id = token.id as string;
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
    ],
    session: {
        strategy: 'jwt' as const,
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
} satisfies NextAuthOptions;