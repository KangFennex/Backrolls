import { NextResponse } from 'next/server';

export async function POST() {
    const response = NextResponse.json({ success: true });

    // Clear the cookie server-side
    response.cookies.set('token', '', {
        httpOnly: true,
        path: '/',
        expires: new Date(0)
    });

    return response;
};