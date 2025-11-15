import { NextRequest, NextResponse } from 'next/server';
import { getFilteredQuotes } from '../data/data';

export async function GET(request: NextRequest) {

    const { searchParams } = new URL(request.url);

    const region = searchParams.get('region') || undefined;
    const series = searchParams.get('series') || undefined;
    const season = searchParams.get('season') ? parseInt(searchParams.get('season')!) : undefined;
    const episode = searchParams.get('episode') ? parseInt(searchParams.get('episode')!) : undefined;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50;

    try {
        const quotes = await getFilteredQuotes({ region, series, season, episode, limit });

        return NextResponse.json({ quotes, count: quotes.length });

    } catch (error) {
        console.error('Error in series route:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }

}
