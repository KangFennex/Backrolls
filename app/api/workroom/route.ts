import { NextRequest, NextResponse } from 'next/server';
import { getRandomQuote } from '../data/data';

export async function GET(request: NextRequest) {
    try {
        // Validate limit (max 30 to prevent abuse)
        const url = new URL(request.url);
        const limitParam = url.searchParams.get('limit');
        const limit = limitParam ? parseInt(limitParam, 10) : 30; // Default to 30 for workroom

        // Validate limit (max 30 to prevent abuse)
        const validatedLimit = Math.min(Math.max(limit, 1), 30);

        const result = await getRandomQuote(validatedLimit);

        if (!result) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'No quotes found in database'
                },
                { status: 404 }
            );
        }

        // Return consistent structure - always use 'quote' key for backward compatibility
        return NextResponse.json({
            quote: result,
        });
    } catch (error) {
        console.error('Error in random route:', error);

        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
