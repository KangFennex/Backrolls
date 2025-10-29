import { NextRequest, NextResponse } from 'next/server';
import { toggleFavoriteQuote, getUserFavoritesWithDetails } from '../favorites/favorites';
import { getUserFromRequest } from '../../lib/auth';
import { FavoriteQuoteDetails } from '../../lib/definitions';

export async function POST(request: NextRequest) {
    try {
        const userId = await getUserFromRequest();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { quote_id } = await request.json();


        const result = await toggleFavoriteQuote(quote_id, userId);

        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const userId = await getUserFromRequest();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get user's favorites from the database
        const favoritesWithDetails = await getUserFavoritesWithDetails(userId) as unknown as FavoriteQuoteDetails[];
        const favoriteIds = favoritesWithDetails.map(quote => quote.id);

        return NextResponse.json({
            favorites: favoritesWithDetails,
            favoriteIds: favoriteIds
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}