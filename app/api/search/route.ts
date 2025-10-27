import { NextRequest, NextResponse } from 'next/server';
import { searchQuotes } from '../data/data';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const query = searchParams.get('q');

        if (!query || !query.trim()) {
            return NextResponse.json({ quotes: [] });
        }

        const results = await searchQuotes(query);
        return NextResponse.json({ quotes: results });
    } catch (error) {
        console.error('Search API error:', error);
        return NextResponse.json(
            { error: 'Search failed' },
            { status: 500 }
        );
    }
}