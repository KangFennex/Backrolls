import { NextRequest, NextResponse } from 'next/server';
import { getRandomQuote } from '../data/data';

export async function GET(request: NextRequest) {
    try {
        // Use request parameter to avoid Vercel deployment issues
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const url = new URL(request.url);
        
        const quote = await getRandomQuote();
        
        if (!quote) {
            return NextResponse.json(
                { 
                    success: false, 
                    error: 'No quotes found in database' 
                },
                { status: 404 }
            );
        }
        
        return NextResponse.json({ quote });
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
