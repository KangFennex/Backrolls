import { NextRequest, NextResponse } from 'next/server';
import { getRecentQuotes } from '../data/data';

export async function GET(request: NextRequest) {
    try {
        // Extract query parameters for future extensibility
        const url = new URL(request.url);
        const limit = parseInt(url.searchParams.get('limit') || '10');
        
        // Validate limit (max 50 to prevent abuse)
        const validatedLimit = Math.min(Math.max(limit, 1), 50);
        
        const quotes = await getRecentQuotes(validatedLimit);

        return NextResponse.json({ quotes, count: quotes.length });

    } catch (error) {
        console.error('Error in fresh route:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }

}
