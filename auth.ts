import NextAuth from "next-auth/next"
import { authConfig } from "./auth.config"

// Type assertion to bypass NextAuth v4 type checking issues
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const auth = NextAuth(authConfig as any);