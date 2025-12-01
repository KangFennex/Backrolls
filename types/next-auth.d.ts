declare module "next-auth" {
  interface Session {
    user: {
      id: string
      username?: string | null
      email?: string | null
      name?: string | null
      image?: string | null
    }
    remember?: boolean
  }

  interface User {
    id: string
    username?: string | null
    email?: string | null
    name?: string | null
    image?: string | null
    remember?: boolean
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string
    sub?: string
    username?: string | null
    email?: string | null
    name?: string | null
    remember?: boolean
    exp?: number
  }
}