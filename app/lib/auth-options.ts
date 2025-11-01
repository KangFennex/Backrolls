import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { createClient } from "@supabase/supabase-js";
import { ExtendedUser } from "./definitions";

// Define basic types for NextAuth callbacks
interface NextAuthUser {
    id: string;
    email?: string | null;
    name?: string | null;
    image?: string | null;
    username?: string | null;
    remember?: boolean;
}

interface NextAuthAccount {
    provider: string;
    type: string;
    [key: string]: unknown;
}

interface NextAuthToken {
    [key: string]: unknown;
}

interface NextAuthSession {
    user: {
        id?: string;
        name?: string | null;
        email?: string | null;
        image?: string | null;
        username?: string | null;
    };
    [key: string]: unknown;
}

// Define the configuration type since NextAuth v4 types aren't resolving properly
interface AuthConfig {
    providers: unknown[];
    secret?: string;
    session?: unknown;
    callbacks?: {
        signIn?: (params: { user: NextAuthUser; account: NextAuthAccount | null }) => boolean | Promise<boolean>;
        jwt?: (params: { token: NextAuthToken; user?: NextAuthUser; account?: NextAuthAccount | null }) => NextAuthToken | Promise<NextAuthToken>;
        session?: (params: { session: NextAuthSession; token: NextAuthToken }) => NextAuthSession | Promise<NextAuthSession>;
    };
    pages?: {
        signIn?: string;
        error?: string;
        [key: string]: string | undefined;
    };
}

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const authOptions: AuthConfig = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code"
                }
            }
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
                remember: { label: "Remember me", type: "checkbox" },
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
                    remember: credentials.remember === "true",
                }
            },
        }),
    ],
    session: {
        strategy: "jwt" as const,
        maxAge: 24 * 60 * 60, // Default: 1 day (will be extended if "remember me" is checked)
    },
    callbacks: {
        async signIn({ user, account }) {
            // Handle Google OAuth sign-in
            if (account?.provider === "google") {
                try {
                    // Check if user exists in Supabase
                    const { data: existingProfile, error: fetchError } = await supabase
                        .from("profiles")
                        .select("*")
                        .eq("email", user.email)
                        .single();

                    if (fetchError && fetchError.code !== 'PGRST116') {
                        console.error("Error checking existing profile:", fetchError);
                        return false;
                    }

                    if (!existingProfile) {
                        // Create new profile for Google user
                        const username = user.email?.split('@')[0] || user.name?.replace(/\s/g, '').toLowerCase();

                        const { error: insertError } = await supabase
                            .from("profiles")
                            .insert({
                                id: user.id,
                                email: user.email,
                                username: username,
                                created_at: new Date().toISOString(),
                            });

                        if (insertError) {
                            console.error("Error creating Google user profile:", insertError);
                            return false;
                        }
                    }
                } catch (error) {
                    console.error("Google sign-in error:", error);
                    return false;
                }
            }
            return true;
        },
        async jwt({ token, user, account }) {
            if (user) {
                console.log('JWT callback - user login detected:', user.email);
                token.id = user.id;
                token.email = user.email;

                // Handle remember me for credentials login
                const remember = (user as NextAuthUser).remember;
                if (remember) {
                    // Extend session to 30 days if remember me is checked
                    token.remember = true;
                }

                // For Google OAuth, get username from profile
                if (account?.provider === "google") {
                    // Fetch username from Supabase profile
                    const { data: profile } = await supabase
                        .from("profiles")
                        .select("username")
                        .eq("email", user.email)
                        .single();

                    token.username = profile?.username || user.email?.split('@')[0];
                } else {
                    // For credentials login, username comes from authorize function
                    token.username = (user as NextAuthUser).username;
                }
            }

            // Set dynamic expiration based on remember me
            if (token.remember) {
                token.exp = Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60); // 30 days
            }

            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                const extendedUser = session.user as ExtendedUser;
                extendedUser.id = token.id as string;
                extendedUser.username = token.username as string;
                extendedUser.email = token.email as string;

                // Add remember flag to session for frontend use
                (session as typeof session & { remember?: boolean }).remember = typeof token.remember === 'boolean' ? token.remember : undefined;
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
        error: "/login",
    },
};