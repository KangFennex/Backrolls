import NextAuth from "next-auth/next"
import { authConfig } from "./auth.config"
 
export const auth = NextAuth(authConfig);