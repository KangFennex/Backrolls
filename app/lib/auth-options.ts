import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { createClient } from "@supabase/supabase-js";
import type { User, Session } from "next-auth";
import type { JWT } from "next-auth/jwt";

// Extended interfaces for custom properties
interface ExtendedUser extends User {
    username?: string;
    remember?: boolean;
}

interface ExtendedSession extends Session {
    user: {
        id: string;
        username?: string;
        email?: string | null;
        name?: string | null;
        image?: string | null;
    };
    remember?: boolean;
}

// Create types for callback parameters without using Account type
interface SignInParams {
    user: User;
    account: {
        provider: string;
        type: string;
        [key: string]: unknown;
    } | null;
}

interface JWTCallbackParams {
    token: JWT;
    user?: User;
    account?: {
        provider: string;
        type: string;
        [key: string]: unknown;
    } | null;
}

interface SessionCallbackParams {
    session: Session;
    token: JWT;
}

// Create a type for our custom token properties
type CustomTokenProps = {
    username?: string;
    remember?: boolean;
};

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const authOptions = {
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
            async authorize(credentials) {
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

                const user: ExtendedUser = {
                    id: data.user.id,
                    email: data.user.email,
                    username: profile.username,
                    remember: credentials.remember === "true",
                };

                return user;
            },
        }),
    ],
    session: {
        strategy: "jwt" as const,
        maxAge: 24 * 60 * 60, // Default: 1 day
    },
    callbacks: {
        async signIn(params: SignInParams) {
            const { user, account } = params;

            // Handle Google OAuth sign-in
            if (account?.provider === "google") {
                try {
                    // Check if user exists in Supabase
                    const { data: existingProfile, error: fetchError } = await supabase
                        .from("profiles")
                        .select("*")
                        .eq("email", user.email ?? "")
                        .single();

                    if (fetchError && fetchError.code !== 'PGRST116') {
                        console.error("Error checking existing profile:", fetchError);
                        return false;
                    }

                    if (!existingProfile) {
                        // Create new profile for Google user
                        const username = user.email?.split('@')[0] || user.name?.replace(/\s/g, '').toLowerCase() || `user_${Date.now()}`;

                        const { error: insertError } = await supabase
                            .from("profiles")
                            .insert({
                                id: user.id,
                                email: user.email ?? "",
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
        async jwt(params: JWTCallbackParams) {
            const { token, user, account } = params;

            // Use type assertion for our custom properties
            const customToken = token as JWT & CustomTokenProps;

            if (user) {
                console.log('JWT callback - user login detected:', user.email);
                customToken.id = user.id;
                customToken.email = user.email;

                // Handle remember me for credentials login
                const extendedUser = user as ExtendedUser;
                if (extendedUser.remember) {
                    customToken.remember = true;
                }

                // For Google OAuth, get username from profile
                if (account?.provider === "google") {
                    // Fetch username from Supabase profile
                    const { data: profile } = await supabase
                        .from("profiles")
                        .select("username")
                        .eq("email", user.email ?? "")
                        .single();

                    customToken.username = profile?.username || user.email?.split('@')[0];
                } else {
                    // For credentials login, username comes from authorize function
                    customToken.username = extendedUser.username;
                }
            }

            // Set dynamic expiration based on remember me
            if (customToken.remember) {
                customToken.exp = Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60); // 30 days
            }

            return customToken;
        },
        async session(params: SessionCallbackParams) {
            const { session, token } = params;

            const extendedSession = session as ExtendedSession;
            const customToken = token as JWT & CustomTokenProps;

            if (customToken && extendedSession.user) {
                extendedSession.user.id = customToken.id ?? "";
                extendedSession.user.username = customToken.username;
                extendedSession.user.email = customToken.email ?? null;
                extendedSession.remember = customToken.remember;
            }

            return extendedSession;
        },
    },
    pages: {
        signIn: "/login",
        error: "/login",
    },
};