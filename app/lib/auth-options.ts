import type { User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { createClient } from "@supabase/supabase-js";
import { ExtendedUser } from "./definitions";
import type { Session } from "next-auth";
import type { JWT } from "next-auth/jwt";

// Define missing types from next-auth v4 that aren't properly exported
interface Account {
    provider: string;
    type: string;
    providerAccountId: string;
    access_token?: string;
    expires_at?: number;
    refresh_token?: string;
    id_token?: string;
    scope?: string;
    token_type?: string;
}

interface Profile {
    sub?: string;
    name?: string;
    email?: string;
    image?: string;
}

// ReturnType of provider functions - use ReturnType to infer from actual providers
type Provider = ReturnType<typeof GoogleProvider> | ReturnType<typeof CredentialsProvider>;

// Define AuthOptions type locally based on next-auth v4 structure
interface AuthOptions {
    providers: Provider[];
    session?: {
        strategy?: "jwt" | "database";
        maxAge?: number;
    };
    callbacks?: {
        signIn?: (params: { user: User; account: Account | null; profile?: Profile }) => Promise<boolean> | boolean;
        jwt?: (params: { token: JWT; user?: User; account?: Account | null }) => Promise<JWT> | JWT;
        session?: (params: { session: Session; token: JWT }) => Promise<Session> | Session;
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

export const authOptions: AuthOptions = {
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
            async authorize(credentials): Promise<User | null> {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                const { data, error } = await supabase.auth.signInWithPassword({
                    email: credentials.email,
                    password: credentials.password,
                });

                if (error) {
                    // Return specific error messages based on the error type
                    if (error.message.includes('Invalid login credentials')) {
                        throw new Error("Invalid email or password");
                    } else if (error.message.includes('Email not confirmed')) {
                        throw new Error("Please verify your email address");
                    } else {
                        throw new Error("Login failed. Please try again.");
                    }
                }

                if (!data.user) {
                    throw new Error("User not found");
                }

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
                };
            },
        }),
    ],
    session: {
        strategy: "jwt" as const,
        maxAge: 24 * 60 * 60,
    },
    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider === "google") {
                try {
                    const { data: existingProfile, error: fetchError } = await supabase
                        .from("profiles")
                        .select("*")
                        .eq("email", user.email!)
                        .single();

                    if (fetchError && fetchError.code !== 'PGRST116') {
                        console.error("Error checking existing profile:", fetchError);
                        return false;
                    }

                    if (!existingProfile) {
                        const username = user.email?.split('@')[0] || user.name?.replace(/\s/g, '').toLowerCase() || `user_${Date.now()}`;

                        const { error: insertError } = await supabase
                            .from("profiles")
                            .insert({
                                id: user.id,
                                email: user.email! ?? "",
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
            // Add custom properties to token
            if (user) {
                token.id = user.id;

                // Handle remember me
                if ((user as ExtendedUser).remember) {
                    token.remember = true;
                }

                // Set username
                if (account?.provider === "google") {
                    const { data: profile } = await supabase
                        .from("profiles")
                        .select("username")
                        .eq("email", user.email!)
                        .single();

                    token.username = profile?.username || user.email?.split('@')[0];
                } else {
                    token.username = (user as ExtendedUser).username;
                }
            }

            // Set expiration if remember me is enabled
            if (token.remember) {
                token.exp = Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60);
            }

            return token;
        },
        async session({ session, token }) {
            // Add custom properties to session
            if (session.user) {
                session.user.id = token.id as string;
                session.user.username = token.username as string;
                session.remember = token.remember;
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
        error: "/login",
    },
};