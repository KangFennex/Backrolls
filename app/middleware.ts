import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET = process.env.JWT_SECRET!;

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;

    if (
        request.nextUrl.pathname.startsWith('/login') ||
        request.nextUrl.pathname.startsWith('/signup') ||
        request.nextUrl.pathname.startsWith('/backrolls') ||
        request.nextUrl.pathname.startsWith('/_next')
    ) {
        return NextResponse.next();
    }

    if (!token) {
        // Redirect to login if no token
        return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
        // Verify JWT
        await jwtVerify(token, new TextEncoder().encode(SECRET));
        return NextResponse.next();
    } catch (err) {
        // Invalid token, redirect to login
        return NextResponse.redirect(new URL('/login', request.url));
    }
}