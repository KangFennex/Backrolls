'use client';

import '@/app/scss/components/ActionButtons.scss';
import { useSession } from 'next-auth/react';
import { AiOutlineLike, AiOutlineDislike } from 'react-icons/ai';
import { useCommentVote, usePostCommentVote } from '../../../lib/hooks';

// Comment vote buttons for backrolls (quote comments)
export function CommentVoteButtons({
    commentId,
    initialVoteCount = 0,
}: {
    commentId: string;
    initialVoteCount?: number;
}) {
    const { data: session } = useSession();
    const { displayVoteCount, userVote, handleVote, isLoading } = useCommentVote({
        commentId,
        initialVoteCount,
    });

    const isAuthenticated = !!session;

    return (
        <div className="buttons-group">
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    handleVote('up');
                }}
                disabled={!isAuthenticated || isLoading}
                aria-label="Upvote"
                className="action-btn__vote-button"
            >
                <AiOutlineLike
                    size={18}
                    className={userVote === 'up' ? 'active' : ''}
                />
            </button>

            <span className="action-btn__vote-count">{displayVoteCount}</span>

            <button
                onClick={(e) => {
                    e.stopPropagation();
                    handleVote('down');
                }}
                disabled={!isAuthenticated || isLoading}
                aria-label="Downvote"
                className="action-btn__vote-button"
            >
                <AiOutlineDislike
                    size={18}
                    className={userVote === 'down' ? 'active' : ''}
                />
            </button>
        </div>
    );
}

// Comment vote buttons for tea-room (post comments)
export function PostCommentVoteButtons({
    commentId,
    initialVoteCount = 0,
}: {
    commentId: string;
    initialVoteCount?: number;
}) {
    const { data: session } = useSession();
    const { displayVoteCount, userVote, handleVote, isLoading } = usePostCommentVote({
        commentId,
        initialVoteCount,
    });

    const isAuthenticated = !!session;

    return (
        <div className="buttons-group">
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    handleVote('up');
                }}
                disabled={!isAuthenticated || isLoading}
                aria-label="Upvote"
                className="action-btn__vote-button"
            >
                <AiOutlineLike
                    size={18}
                    className={userVote === 'up' ? 'active' : ''}
                />
            </button>

            <span className="action-btn__vote-count">{displayVoteCount}</span>

            <button
                onClick={(e) => {
                    e.stopPropagation();
                    handleVote('down');
                }}
                disabled={!isAuthenticated || isLoading}
                aria-label="Downvote"
                className="action-btn__vote-button"
            >
                <AiOutlineDislike
                    size={18}
                    className={userVote === 'down' ? 'active' : ''}
                />
            </button>
        </div>
    );
}
