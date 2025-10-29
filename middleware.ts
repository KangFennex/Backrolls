import { withAuth } from "next-auth/middleware"

export default withAuth(
    function middleware() {
        // Add any additional middleware logic here if needed
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                // Protect specific routes
                const protectedRoutes = ['/lounge', '/submit']
                const isProtectedRoute = protectedRoutes.some(route =>
                    req.nextUrl.pathname.startsWith(route)
                )

                // Allow access to protected routes only if user has a token
                if (isProtectedRoute) {
                    return !!token
                }

                // Allow access to all other routes
                return true
            },
        },
    }
)

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}