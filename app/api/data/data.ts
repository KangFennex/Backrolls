import { createClient } from '@supabase/supabase-js';

// Get environment variables with proper fallbacks and validation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Debug logging for server components
if (typeof window === 'undefined') {
    console.log('Server-side environment check:');
    console.log('NEXT_PUBLIC_SUPABASE_URL:', !!process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log('SUPABASE_URL:', !!process.env.SUPABASE_URL);
    console.log('SUPABASE_SERVICE_ROLE_KEY:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);
    console.log('Resolved URL:', !!supabaseUrl);
    console.log('Resolved Key:', !!supabaseKey);
}

if (!supabaseUrl) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_URL environment variable');
}

if (!supabaseKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
}

const supabase = createClient(supabaseUrl, supabaseKey);

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

// Function to get random quote(s)
export async function getRandomQuote(limit: number = 1) {
    try {
        // Method 1: Use RPC with custom PostgreSQL function
        const { data: randomQuotes, error: randomError } = await supabase
            .rpc('get_random_quotes', { quote_limit: limit });

        // Add detailed error logging
        if (randomError) {
            console.error('RPC Error Details:', randomError);
            console.error('Error code:', randomError.code);
            console.error('Error message:', randomError.message);
        }

        if (!randomError && randomQuotes && randomQuotes.length > 0) {
            console.log(`${randomQuotes.length} random quote(s) fetched with RPC function`);
            return randomQuotes; // Always return array for consistency
        }

        console.log('RPC function failed, trying alternative method...');
        if (randomError) {
            console.log('RPC failed with error:', randomError.message);
        } else {
            console.log('RPC returned no data or empty array');
        }

        // Method 2: Fallback - Get all quotes and pick randomly
        const { data: allQuotes, error: allError } = await supabase
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
                user_id,
                is_approved,
                vote_count,
                share_count
            `)
            .limit(Math.max(100, limit * 10)); // Get more quotes to ensure randomness

        if (allError) {
            console.error('Error fetching quotes for random selection:', allError);
            return []; // Return empty array instead of null
        }

        if (!allQuotes || allQuotes.length === 0) {
            console.log('No quotes found in database');
            return []; // Return empty array instead of null
        }

        // Pick random quote(s) from the results
        const selectedQuotes = [];
        const usedIndexes = new Set();

        for (let i = 0; i < Math.min(limit, allQuotes.length); i++) {
            let randomIndex;
            do {
                randomIndex = Math.floor(Math.random() * allQuotes.length);
            } while (usedIndexes.has(randomIndex));

            usedIndexes.add(randomIndex);
            selectedQuotes.push(allQuotes[randomIndex]);
        }

        console.log(`${selectedQuotes.length} random quote(s) selected from fallback method`);
        return selectedQuotes; // Always return array for consistency

    } catch (error) {
        console.error('Unexpected error in getRandomQuote:', error);
        return []; // Return empty array instead of null for consistency
    }
}

// Function to get quiz questions with wrong answer options
export async function getQuizQuotes(limit: number = 10) {
    try {
        // Step 1: Get random quotes for the quiz
        const quotes = await getRandomQuote(limit);

        if (!quotes || quotes.length === 0) {
            console.log('No quotes available for quiz');
            return [];
        }

        // Step 2: Get a pool of unique speakers for wrong answer options
        const { data: allSpeakers, error: speakersError } = await supabase
            .from('quotes')
            .select('speaker')
            .order('speaker', { ascending: true });

        if (speakersError) {
            console.error('Error fetching speakers for quiz options:', speakersError);
            return [];
        }

        // Create unique speaker pool (excluding duplicates)
        const uniqueSpeakers = [...new Set(allSpeakers?.map(s => s.speaker) || [])];

        // Step 3: Build quiz questions with options
        const quizQuestions = quotes.map((quote) => {
            const correctSpeaker = quote.speaker;

            // Get 3 wrong answers (different from correct speaker)
            const wrongOptions = uniqueSpeakers
                .filter(speaker => speaker !== correctSpeaker)
                .sort(() => Math.random() - 0.5) // Shuffle
                .slice(0, 3);

            // Combine correct answer with wrong answers and shuffle
            const allOptions = [correctSpeaker, ...wrongOptions].sort(() => Math.random() - 0.5);

            return {
                id: quote.id.toString(),
                quote: quote.quote_text,
                correctSpeaker: correctSpeaker,
                series: quote.series,
                season: quote.season,
                episode: quote.episode,
                options: allOptions
            };
        });

        console.log(`Generated ${quizQuestions.length} quiz questions`);
        return quizQuestions;

    } catch (error) {
        console.error('Unexpected error in getQuizQuotes:', error);
        return [];
    }
}