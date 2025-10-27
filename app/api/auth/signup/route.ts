import { NextRequest, NextResponse } from 'next/server';
import { signup } from '../../../(pages)/signup/actions';

// Route for signing up
export async function POST(req: NextRequest) {
    const formData = await req.formData();
    const result = await signup({}, formData);

    if (result.errors || result.error) {
        return NextResponse.json(result, { status: 400 });
    }

    // Set JWT cookie using jose-generated token
    const response = NextResponse.json({ success: true, user: result.user });
    response.cookies.set('token', result.token, {
        httpOnly: true,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 7 days
    });
    return response;
}