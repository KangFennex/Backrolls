import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Get user's favorites
export async function getUserFavorites(userId: string): Promise<string[]> {
    if (!userId) return [];

    try {
        const { data: favorites, error } = await supabase
            .from('user_favorites')
            .select('quote_id')
            .eq('user_id', userId);

        if (error) {
            console.error('Error fetching user favorites:', error);
            return [];
        }

        return favorites?.map(f => f.quote_id) || [];
    } catch (error) {
        console.error('Error in getUserFavorites:', error);
        return [];
    }
}

export async function getUserFavoritesWithDetails(userId: string) {
    if (!userId) return [];

    try {
        const { data: favorites, error } = await supabase
            .from('user_favorites')
            .select(`
                quote_id,
                quotes (
                    id,
                    quote_text,
                    created_at,
                    series,
                    season,
                    episode,
                    timestamp,
                    speaker,
                    context,
                    vote_count,
                    share_count
                )
            `)
            .eq('user_id', userId);

        if (error) {
            console.error('Error fetching user favorites with details:', error);
            return [];
        }
        return favorites?.map(fav => fav.quotes).filter(Boolean) || [];
    } catch (error) {
        console.error('Error in getUserFavoritesWithDetails:', error);
        return [];
    }
}

// Toggle a favorite quote
export async function toggleFavoriteQuote(quote_id: string | number, userId: string) {
    if (!quote_id || !userId) {
        return { success: false, message: 'Quote ID and User ID are required.' };
    }

    try {
        // Check if favorite exists
        const { data: favorite, error: selectError } = await supabase
            .from('user_favorites')
            .select('*')
            .eq('quote_id', quote_id)
            .eq('user_id', userId)
            .maybeSingle();

        if (selectError) {
            console.error('Error checking favorite:', selectError);
            return { success: false, message: 'Error checking favorite status.' };
        }

        // If favorite exists, remove it
        if (favorite) {
            const { error: deleteError } = await supabase
                .from('user_favorites')
                .delete()
                .eq('quote_id', quote_id)
                .eq('user_id', userId);

            if (deleteError) {
                console.error('Error removing favorite:', deleteError);
                return { success: false, message: 'Error removing favorite.' };
            }

            return { success: true, message: 'Quote removed from favorites.' };
        }

        // If favorite doesn't exist, add it
        const { error: insertError } = await supabase
            .from('user_favorites')
            .insert({
                quote_id: quote_id,
                user_id: userId
            });

        if (insertError) {
            console.error('Error adding favorite:', insertError);
            return { success: false, message: 'Error adding favorite.' };
        }

        return { success: true, message: 'Quote added to favorites.' };

    } catch (error) {
        console.error('Caught exception in toggleFavoriteQuote:', error);
        return { success: false, message: 'Exception occurred.' };
    }
}