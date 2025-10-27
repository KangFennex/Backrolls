import { NextRequest, NextResponse } from 'next/server';
import { getRecentQuotes, getTopRatedQuotes } from '../data/data';

export async function GET(request: NextRequest) {

    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type') || 'recent';
        const limit = parseInt(searchParams.get('limit') || '10');

        let quotes;

        switch (type) {
            case 'recent':
                quotes = await getRecentQuotes(limit);
                break;
            case 'top-rated':
                quotes = await getTopRatedQuotes(limit);
                break;
            default:
                return NextResponse.json(
                    { success: false, error: 'Invalid type parameter' },
                    { status: 400 }
                );
        }

        return NextResponse.json({
            success: true,
            quotes,
            type
        });

    } catch (error) {
        console.error('Error in display route:', error);

        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        )
    }
}
