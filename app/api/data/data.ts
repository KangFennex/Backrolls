import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Search function
export async function searchQuotes(input: string) {
    if (!input.trim()) return [];

    console.log('Searching quotes for:', input);

    const { data: quotes, error } = await supabase
        .from('quotes')
        .select(`
            id,
            quote_text,
            created_at,
            category,
            series,
            season,
            episode,
            timestamp,
            speaker,
            context,
            user_id,
            is_approved,
            vote_count,
            share_count
        `)
        .or(`quote_text.ilike.%${input}%,speaker.ilike.%${input}%`)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error searching quotes:', error);
        return [];
    }

    return quotes || [];
}

// Display function for a specific quote by ID
export async function getQuoteById(id: string | number) {
    if (!id) return null;

    console.log('Fetching quote with ID:', id);

    const { data: quote, error } = await supabase
        .from('quotes')
        .select(`
            id,
            quote_text,
            created_at,
            category,
            series,
            season,
            episode,
            timestamp,
            speaker,
            context,
            user_id,
            is_approved,
            vote_count,
            share_count
        `)
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching quote by ID:', error);
        return null;
    }

    return quote || null;
}

// Function to get recent quotes
export async function getRecentQuotes(limit: number = 10) {
    const { data: quotes, error } = await supabase
        .from('quotes')
        .select(`
            id,
            quote_text,
            created_at,
            category,
            series,
            season,
            episode,
            timestamp,
            speaker,
            context,
            user_id,
            is_approved,
            vote_count,
            share_count
        `)
        .order('created_at', { ascending: false })
        .limit(limit);

    if (error) {
        console.error('Error fetching recent quotes:', error);
        return [];
    }
    return quotes || [];
}

export async function getTopRatedQuotes(limit: number = 10) {
    const { data: quotes, error } = await supabase
        .from('quotes')
        .select(`
            id, 
            quote_text, 
            created_at,
            category,
            series, 
            season, 
            episode,
            timestamp, 
            speaker, 
            context, 
            user_id, 
            is_approved,
            vote_count, 
            share_count
        `)
        .gt('vote_count', 0)
        .order('vote_count', { ascending: false })
        .limit(limit);

    if (error) {
        console.error('Error fetching top-rated quotes:', error);
        return [];
    }

    if (!quotes || quotes.length === 0) {
        return [];
    }

    return quotes;
}

export async function getFilteredQuotes(filters: {
    category?: string;
    series?: string;
    season?: number;
    episode?: number;
    limit?: number;
}) {
    const { category, series, season, episode, limit = 50 } = filters;

    console.log('Filtering quotes with:', filters);

    let query = supabase
        .from('quotes')
        .select(`
            id,
            quote_text,
            created_at,
            category,
            series,
            season,
            episode,
            timestamp,
            speaker,
            context,
            user_id,
            is_approved,
            vote_count,
            share_count
        `);

    if (category) {
        query = query.eq('category', category);
    }

    if (series) {
        query = query.eq('series', series);
    }

    if (season !== undefined && season !== null) {
        query = query.eq('season', season);
    }

    if (episode !== undefined && episode !== null) {
        query = query.eq('episode', episode);
    }

    const { data: quotes, error } = await query
        .order('timestamp', { ascending: true })
        .limit(limit);

    if (error) {
        console.error('Error fetching quotes by category:', error);
        return [];
    }

    return quotes || [];
}
