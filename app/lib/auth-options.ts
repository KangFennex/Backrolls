import CredentialsProvider from "next-auth/providers/credentials";
import { createClient } from "@supabase/supabase-js";
import type { NextAuthOptions, User } from "next-auth";

interface ExtendedUser {
    id?: string;
    username?: string;
    email?: string | null;
    name?: string | null;
    image?: string | null;
}

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials: Record<string, string> | undefined) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                // Supabase sign in
                const { data, error } = await supabase.auth.signInWithPassword({
                    email: credentials.email,
                    password: credentials.password,
                });

                if (error || !data.user) {
                    throw new Error("Invalid email or password");
                }

                // Get user profile from profiles table
                const { data: profile, error: profileError } = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("id", data.user.id)
                    .single();

                if (profileError) {
                    throw new Error("User profile not found");
                }

                return {
                    id: data.user.id,
                    email: data.user.email,
                    username: profile.username,
                }
            },
        }),
    ],
    session: {
        strategy: "jwt" as const,
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                console.log('JWT callback - user login detected:', user.email);
                token.id = user.id;
                token.username = (user as User & { username?: string }).username;
                token.email = user.email;
            }
            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                const extendedUser = session.user as ExtendedUser;
                extendedUser.id = token.id as string;
                extendedUser.username = token.username as string;
                extendedUser.email = token.email as string;
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
        error: "/login",
    },
};