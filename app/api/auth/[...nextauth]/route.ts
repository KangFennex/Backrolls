import NextAuth from "next-auth/next"
import { authOptions } from "@/app/lib/auth-options"

// Type assertion needed for NextAuth v4 type compatibility
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handler = NextAuth(authOptions as any)

export { handler as GET, handler as POST }


