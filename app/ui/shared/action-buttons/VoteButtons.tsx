'use client';

import '@/app/scss/components/ActionButtons.scss';
import { useState } from 'react';
import { AiOutlineLike, AiOutlineDislike } from 'react-icons/ai';
import { useAuth } from '../../../lib/hooks';
import { useVotes, useToggleVote } from '../../../lib/hooks';

// Backroll Card vote buttons (for quotes)
export function VoteButtons({
    quoteId,
    initialVoteCount = 0,
}: {
    quoteId: string;
    initialVoteCount?: number;
}) {
    const { isAuthenticated } = useAuth();

    // Get user's vote status from server
    const { data: votesData } = useVotes();
    const toggleVoteMutation = useToggleVote();

    // Local state for vote count
    const [displayVoteCount, setDisplayVoteCount] = useState(initialVoteCount);

    // Local state for guest users (not persisted)
    const [guestVote, setGuestVote] = useState<'upvote' | 'downvote' | null>(null);

    // Determine user's vote status
    const userVote = isAuthenticated
        ? votesData?.votes.find(v => v.quote_id === quoteId)
        : null;

    const userHasUpvoted = isAuthenticated
        ? userVote?.vote_type === 'upvote'
        : guestVote === 'upvote';

    const userHasDownvoted = isAuthenticated
        ? userVote?.vote_type === 'downvote'
        : guestVote === 'downvote';

    const handleVote = (voteType: 'upvote' | 'downvote') => {
        if (!isAuthenticated) {
            // Guest user - update local state only
            const oldVote = guestVote;

            if (oldVote === voteType) {
                // Remove vote
                setGuestVote(null);
                setDisplayVoteCount(prev => prev + (voteType === 'upvote' ? -1 : 1));
            } else if (oldVote === null) {
                // Add vote
                setGuestVote(voteType);
                setDisplayVoteCount(prev => prev + (voteType === 'upvote' ? 1 : -1));
            } else {
                // Switch vote (e.g., upvote -> downvote means -2)
                setGuestVote(voteType);
                setDisplayVoteCount(prev => prev + (voteType === 'upvote' ? 2 : -2));
            }
            return;
        }

        // Authenticated user - optimistic update for vote count
        const oldVoteType = userVote?.vote_type;

        if (oldVoteType === voteType) {
            // Removing vote
            setDisplayVoteCount(prev => prev + (voteType === 'upvote' ? -1 : 1));
        } else if (oldVoteType === undefined) {
            // Adding new vote
            setDisplayVoteCount(prev => prev + (voteType === 'upvote' ? 1 : -1));
        } else {
            // Switching vote (±2)
            setDisplayVoteCount(prev => prev + (voteType === 'upvote' ? 2 : -2));
        }

        // Trigger mutation (user's vote status updated in hook)
        toggleVoteMutation.mutate({ quoteId: quoteId, voteType });
    };

    return (
        <div className="buttons-group" style={{ gap: '0.5rem' }}>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    handleVote('upvote');
                }}
                disabled={toggleVoteMutation.isPending}
                aria-label="Upvote"
                className="action-btn__vote-button"
            >
                <AiOutlineLike
                    size={18}
                    className={userHasUpvoted ? 'active' : ''}
                />
            </button>

            <span className="action-btn__vote-count">{displayVoteCount}</span>

            <button
                onClick={(e) => {
                    e.stopPropagation();
                    handleVote('downvote');
                }}
                disabled={toggleVoteMutation.isPending}
                aria-label="Downvote"
                className="action-btn__vote-button"
            >
                <AiOutlineDislike
                    size={18}
                    className={userHasDownvoted ? 'active' : ''}
                />
            </button>
        </div>
    );
}
