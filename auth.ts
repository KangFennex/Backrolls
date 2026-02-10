import NextAuth from "next-auth/next"
import { authOptions } from "./app/lib/auth-options"

// Use the consolidated auth options with proper cookie configuration
// Type assertion needed for NextAuth v4 type compatibility
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const { auth, handlers, signIn, signOut } = NextAuth(authOptions as any);