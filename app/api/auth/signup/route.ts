import { NextRequest, NextResponse } from 'next/server';
import { signup } from '../../../(pages)/signup/actions';

// Route for signing up
export async function POST(req: NextRequest) {
    const formData = await req.formData();
    const result = await signup(formData);

    if (result.errors || result.error) {
        return NextResponse.json(result, { status: 400 });
    }

    // Return success response without setting JWT cookie
    return NextResponse.json({ success: true, user: result.user });
}