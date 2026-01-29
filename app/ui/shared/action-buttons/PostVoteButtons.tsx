'use client';

import '@/app/scss/components/ActionButtons.scss';
import { useState } from 'react';
import { AiOutlineLike, AiOutlineDislike } from 'react-icons/ai';
import { useAuth } from '../../../lib/hooks';
import { useVotesPosts, useTogglePostVote } from '../../../lib/hooks';

// Post vote buttons (for community posts)
export function PostVoteButtons({
    post_id,
    initialVoteCount = 0,
}: {
    post_id: string;
    initialVoteCount?: number;
}) {
    const { isAuthenticated } = useAuth();
    const { data: votesData } = useVotesPosts();
    const voteMutation = useTogglePostVote();
    const [displayVoteCount, setDisplayVoteCount] = useState(initialVoteCount);
    const [guestVote, setGuestVote] = useState<'up' | 'down' | null>(null);

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
            const oldVote = guestVote;
            if (oldVote === voteType) {
                setGuestVote(null);
                setDisplayVoteCount(prev => prev + (voteType === 'up' ? -1 : 1));
            } else if (oldVote === null) {
                setGuestVote(voteType);
                setDisplayVoteCount(prev => prev + (voteType === 'up' ? 1 : -1));
            } else {
                setGuestVote(voteType);
                setDisplayVoteCount(prev => prev + (voteType === 'up' ? 2 : -2));
            }
            return;
        }

        const oldVoteType = userVote?.vote_type;
        if (oldVoteType === voteType) {
            setDisplayVoteCount(prev => prev + (voteType === 'up' ? -1 : 1));
        } else if (oldVoteType === null || oldVoteType === undefined) {
            setDisplayVoteCount(prev => prev + (voteType === 'up' ? 1 : -1));
        } else {
            setDisplayVoteCount(prev => prev + (voteType === 'up' ? 2 : -2));
        }
        voteMutation.mutate({ post_id, vote_type: voteType });
    };

    return (
        <div className="buttons-group">
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    handleVote('up');
                }}
                disabled={voteMutation.isPending}
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
                    handleVote('down');
                }}
                disabled={voteMutation.isPending}
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
