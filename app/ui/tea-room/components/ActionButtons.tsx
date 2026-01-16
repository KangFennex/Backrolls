
import { useAuth } from '../../../lib/hooks';
import { useVotesPosts, useTogglePostVote } from '../../../lib/hooks';
import React, { useState } from 'react';
import { AiOutlineLike, AiOutlineDislike } from "react-icons/ai";

export const VoteButtons = ({
    post_id,
    initialVoteCount = 0,
}: {
    post_id: string,
    initialVoteCount?: number,
}) => {
    const { isAuthenticated } = useAuth();

    // Get user's vote status from server
    const { data: votesData } = useVotesPosts();
    const voteMutation = useTogglePostVote();

    // Local state for vote count
    const [displayVoteCount, setDisplayVoteCount] = useState(initialVoteCount);

    // Local state for guest users (not persisted)
    const [guestVote, setGuestVote] = useState<'up' | 'down' | null>(null);

    // Determine user's vote status
    const userVote = isAuthenticated
        ? votesData?.votes.find(v => v.post_id === post_id)
        : null;

    const userHasUpvoted = isAuthenticated
        ? userVote?.vote_type === 'up'
        : guestVote === 'up';

    const userHasDownvoted = isAuthenticated
        ? userVote?.vote_type === 'down'
        : guestVote === 'down';

    const handleVote = (voteType: 'up' | 'down') => {
        if (!isAuthenticated) {
            // Guest user - update local state only
            const oldVote = guestVote;

            if (oldVote === voteType) {
                // Remove vote
                setGuestVote(null);
                setDisplayVoteCount(prev => prev + (voteType === 'up' ? -1 : 1));
            } else if (oldVote === null) {
                // Add vote
                setGuestVote(voteType);
                setDisplayVoteCount(prev => prev + (voteType === 'up' ? 1 : -1));
            } else {
                // Switch vote (e.g., upvote -> downvote means -2)
                setGuestVote(voteType);
                setDisplayVoteCount(prev => prev + (voteType === 'up' ? 2 : -2));
            }
            return;
        }

        // Authenticated user - optimistic update for vote count
        const oldVoteType = userVote?.vote_type;

        if (oldVoteType === voteType) {
            // Remove vote
            setDisplayVoteCount(prev => prev + (voteType === 'up' ? -1 : 1));
        } else if (oldVoteType === null || oldVoteType === undefined) {
            // Add vote
            setDisplayVoteCount(prev => prev + (voteType === 'up' ? 1 : -1));
        } else {
            // Switch vote
            setDisplayVoteCount(prev => prev + (voteType === 'up' ? 2 : -2));
        }
        voteMutation.mutate({ post_id, vote_type: voteType });
    };

    return (
        <div className="flex rounded-full py-1 px-2 items-center justify-center gap-1 bg-white/5 transition-all duration-300"
            aria-label="Vote buttons"
        >
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    handleVote('up');
                }}
                disabled={voteMutation.isPending}
                aria-label="Upvote"
                className="bg-transparent border-none p-0 cursor-pointer"
            >
                <AiOutlineLike
                    size={18}
                    className={`transition-all duration-300 hover:text-pink-500 hover:scale-[1.1] ${userHasUpvoted ? 'text-pink-500' : 'text-[#8a8a8a]'}`}
                />
            </button>

            <span className="text-sm select-none text-[#8a8a8a] min-w-[20px] text-center">{displayVoteCount}</span>

            <button
                onClick={(e) => {
                    e.stopPropagation();
                    handleVote('down');
                }}
                disabled={voteMutation.isPending}
                aria-label="Downvote"
                className="bg-transparent border-none p-0 cursor-pointer"
            >
                <AiOutlineDislike
                    size={18}
                    className={`transition-all duration-300 hover:text-pink-500 hover:scale-[1.1] ${userHasDownvoted ? 'text-pink-500' : 'text-[#8a8a8a]'}`}
                />
            </button>
        </div>
    )
};