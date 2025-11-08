import { NextRequest, NextResponse } from 'next/server';
import { getTopRatedQuotes } from '../data/data';

export async function GET(request: NextRequest) {
    try {

        const limitParam = request.nextUrl.searchParams.get('limit');
        const limit = limitParam ? parseInt(limitParam, 10) : 30;

        // Validate limit (max 30 to prevent abuse)
        const validatedLimit = Math.min(Math.max(limit, 1), 30);

        const quotes = await getTopRatedQuotes(validatedLimit);

        return NextResponse.json({ quotes, count: quotes.length });

    } catch (error) {
        console.error('Error in hot route:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }

}
