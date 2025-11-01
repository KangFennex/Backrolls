import { NextRequest, NextResponse } from 'next/server';
import { getRandomQuote } from '../data/data';

export async function GET(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const limitParam = url.searchParams.get('limit');
        const limit = limitParam ? parseInt(limitParam, 10) : 1;
        
        // Validate limit (max 20 to prevent abuse)
        const validatedLimit = Math.min(Math.max(limit, 1), 20);
        
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
            count: Array.isArray(result) ? result.length : 1
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
