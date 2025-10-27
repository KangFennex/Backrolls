import { NextRequest, NextResponse } from 'next/server';
import { toggleFavoriteQuote, getUserFavoritesWithDetails } from '../favorites/favorites';
import { getUserFromRequest } from '../../lib/auth';

export async function POST(request: NextRequest) {
    try {
        const userId = await getUserFromRequest(request);

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { quote_id } = await request.json();


        const result = await toggleFavoriteQuote(quote_id, userId);

        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const userId = await getUserFromRequest(request);

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get user's favorites from the database
        const favoritesWithDetails = await getUserFavoritesWithDetails(userId);
        const favoriteIds = favoritesWithDetails.map(quote => quote.id);

        return NextResponse.json({
            favorites: favoritesWithDetails,
            favoriteIds: favoriteIds
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}