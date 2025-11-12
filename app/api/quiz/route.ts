import { NextResponse, NextRequest } from "next/server";
import { getQuizQuotes } from '../../api/data/data'

export async function GET(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const limitParam = url.searchParams.get('limit');
        const limit = limitParam ? parseInt(limitParam, 10) : 10;

        // Validate limit (min 10, max 10 for now)
        const validatedLimit = Math.min(Math.max(limit, 10), 10);

        const results = await getQuizQuotes(validatedLimit);

        if (!results || results.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Could not fetch Quiz Backrolls"
                },
                { status: 400 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                data: results,
            },
            { status: 200 }
        );

    } catch (error) {
        console.error('Error in quiz route:', error);
        return NextResponse.json(
            {
                success: false,
                error: "Internal server error"
            },
            { status: 500 }
        );
    }
}

