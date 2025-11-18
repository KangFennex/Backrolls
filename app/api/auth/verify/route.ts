import { NextResponse } from 'next/server';
import { verifyToken } from '../../../lib/auth';

export async function GET() {
    const payload = await verifyToken();

    if (!payload) {
        // Return 200 with authenticated: false instead of 401
        // This prevents console errors when user is not logged in
        return NextResponse.json({ authenticated: false }, { status: 200 });
    }

    return NextResponse.json({
        authenticated: true,
        user: payload
    });
}