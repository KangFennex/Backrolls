import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { createClient } from "@supabase/supabase-js";

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

                const { data, error } = await supabase.auth.signInWithPassword({
                    email: credentials.email,
                    password: credentials.password,
                });

                if (error || !data.user) {
                    throw new Error("Invalid email or password");
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
                                email: user.email!,
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
                if ((user as any).remember) {
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
                    token.username = (user as any).username;
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
                (session as any).remember = token.remember;
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
        error: "/login",
    },
};