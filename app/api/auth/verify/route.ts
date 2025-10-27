import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '../../../lib/auth';

export async function GET(req: NextRequest) {
    const payload = await verifyToken(req);

    if (!payload) {
        return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({
        authenticated: true,
        user: payload
    });
}