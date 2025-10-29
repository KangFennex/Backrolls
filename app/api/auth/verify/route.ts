import { NextResponse } from 'next/server';
import { verifyToken } from '../../../lib/auth';

export async function GET() {
    const payload = await verifyToken();

    if (!payload) {
        return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({
        authenticated: true,
        user: payload
    });
}