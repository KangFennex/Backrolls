import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface SubmitQuoteData {
    quote: string;
    speaker: string;
    series: string;
    season: string;
    episode: string;
    timestamp?: string | null;
    context?: string | null;
    userId: string;
}

// Send a new quote submission

export async function submitQuote(data: SubmitQuoteData) {
    const {
        quote,
        speaker,
        series,
        season,
        episode,
        timestamp,
        context,
        userId
    } = data;

    if (!quote || !speaker || !series || !season || !episode || !userId) {
        throw new Error('Missing required fields');
    }

    try {
        const { data: result, error: insertError } = await supabase
            .from('quotes')
            .insert({
                quote_text: quote,
                speaker,
                series,
                season: parseInt(season),
                episode: parseInt(episode),
                timestamp: timestamp || null,
                context: context || null,
                vote_count: 0,
                share_count: 0,
                user_id: userId,
                is_approved: false,
            })
            .select()
            .single();

        if (insertError) {
            console.error('Database insert error:', insertError);
            throw new Error('Failed to insert quote');
        }

        return {
            success: true,
            data: result
        };

    } catch (error) {
        console.error('Error submitting quote:', error);
        throw new Error('Failed to submit quote');
    }
}