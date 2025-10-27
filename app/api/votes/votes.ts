import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Add or update a vote
export async function toggleVoteOnQuote(
    userId: string,
    quoteId: string,
    vote_type: 'upvote' | 'downvote'
): Promise<{ success: boolean; message?: string; newVoteCount?: number }> {
    if (!userId || !quoteId) {
        return { success: false, message: 'Invalid user or quote ID' };
    }

    try {
        // Check for existing vote
        const { data: existingVotes, error: fetchError } = await supabase
            .from('user_votes')
            .select('vote_type')
            .eq('user_id', userId)
            .eq('quote_id', quoteId)
            .maybeSingle();

        if (fetchError) {
            console.log('Error fetching existing votes:', fetchError);
            return { success: false, message: 'Error fetching existing votes' };
        }

        // Get current vote count from quotes table
        const { data: currentQuote, error: quoteError } = await supabase
            .from('quotes')
            .select('vote_count')
            .eq('id', quoteId)
            .single();

        if (quoteError) {
            console.log('Error fetching current quote:', quoteError);
            return { success: false, message: 'Error fetching current quote' };
        }

        const currentScore = currentQuote.vote_count || 0;

        let voteAction: 'insert' | 'update' | 'delete' = 'insert';

        if (existingVotes) {
            if (existingVotes.vote_type === vote_type) {
                voteAction = 'delete';
            } else {
                voteAction = 'update';
            }
        }

        // Check if the vote action is valid
        if (vote_type === 'downvote') {
            let futureScore = currentScore;

            if (voteAction === 'insert') {
                futureScore = currentScore - 1;
            } else if (voteAction === 'update' && existingVotes?.vote_type === 'upvote') {
                futureScore = currentScore - 2;
            }
            if (futureScore < 0) {
                return { success: false, message: 'Cannot downvote: would make score negative' };
            }
        }

        // Perform vote action
        if (voteAction === 'delete') {
            const { error: deleteError } = await supabase
                .from('user_votes')
                .delete()
                .eq('user_id', userId)
                .eq('quote_id', quoteId);

            if (deleteError) {
                console.log('Error deleting vote:', deleteError);
                return { success: false, message: 'Error deleting vote' };
            }
        } else if (voteAction === 'update') {
            const { error: updateError } = await supabase
                .from('user_votes')
                .update({ vote_type: vote_type })
                .eq('user_id', userId)
                .eq('quote_id', quoteId);

            if (updateError) {
                console.log('Error updating vote:', updateError);
                return { success: false, message: 'Error updating vote' };
            }
        } else {
            const { error: insertError } = await supabase
                .from('user_votes')
                .insert({ user_id: userId, quote_id: quoteId, vote_type: vote_type });

            if (insertError) {
                console.log('Error inserting vote:', insertError);
                return { success: false, message: 'Error inserting vote' };
            }
        }

        const { data: allVotes, error: countError } = await supabase
            .from('user_votes')
            .select('vote_type')
            .eq('quote_id', quoteId);

        if (countError) {
            console.log('Error fetching all votes for count:', countError);
            return { success: false, message: 'Error fetching vote counts' };
        }

        // Calculate new score
        let newVoteCount = 0;
        allVotes?.forEach(vote => {
            if (vote.vote_type === 'upvote') newVoteCount += 1;
            if (vote.vote_type === 'downvote') newVoteCount -= 1;
        });

        const { error: updateQuoteError } = await supabase
            .from('quotes')
            .update({ vote_count: newVoteCount })
            .eq('id', quoteId);

        if (updateQuoteError) {
            console.log('Error updating quote vote count:', updateQuoteError);
            return { success: false, message: 'Error updating quote vote count' };
        }

        return {
            success: true,
            message: `Vote ${voteAction}d successfully`,
            newVoteCount
        };

    } catch (error) {
        console.log('Error in toggleVoteOnQuote:', error);
        return { success: false, message: 'Database error' };
    }
}

// Get user's votes
export async function getUserVotes(userId: string): Promise<{ quote_id: string; vote_type: 'upvote' | 'downvote' }[]> {
    if (!userId) return [];

    try {
        const { data, error } = await supabase
            .from('user_votes')
            .select('quote_id, vote_type')
            .eq('user_id', userId);

        if (error) {
            console.log('Error fetching user votes:', error);
            return [];
        }
        return data || [];
    } catch (error) {
        console.log('Error fetching user votes:', error);
        return [];
    }
}