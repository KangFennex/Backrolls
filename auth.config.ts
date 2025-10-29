import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isProtectedRoute = nextUrl.pathname.startsWith('/lounge') ||
                nextUrl.pathname.startsWith('/submit');

            if (isProtectedRoute) {
                if (isLoggedIn) return true;
                return false; // Redirect unauthenticated users to login page
            }

            return true; // Allow access to public routes
        },
        async jwt({ token, user, account }) {
            if (user) {
                token.id = user.id;
            }
            if (account?.provider === 'google') {
                // Handle Google user data here
            }
            return token;
        },
        async session({ session, token }) {
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
        strategy: 'jwt',
        macAge: 30 * 24 * 60 * 60, // 30 days
    },
} satisfies NextAuthConfig;