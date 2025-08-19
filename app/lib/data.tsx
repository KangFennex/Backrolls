import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

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
        .eq('is_approved', true)
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