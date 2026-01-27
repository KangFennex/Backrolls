import '@/app/scss/components/ActionButtons.scss';
import { useAuth } from '../../../lib/hooks';
import { useVotesPosts, useTogglePostVote } from '../../../lib/hooks';
import React, { useState } from 'react';
import { AiOutlineLike, AiOutlineDislike } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa6";
import { IoShareSocialSharp } from "react-icons/io5";
import { trpc } from '@/app/lib/trpc';
import Link from 'next/link';

export const PostVoteButtons = ({
    post_id,
    initialVoteCount = 0,
}: {
    post_id: string,
    initialVoteCount?: number,
}) => {
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
};

export const CommentVoteButtons = ({
    commentId,
    initialVoteCount = 0,
    currentUserId,
    onVote,
}: {
    commentId: string,
    initialVoteCount?: number,
    currentUserId?: string,
    onVote: (voteType: 'up' | 'down') => void,
}) => {
    const [voteCount, setVoteCount] = useState(initialVoteCount);

    const { data: userVote } = trpc.postComment.getUserCommentVote.useQuery(
        { commentId },
        { enabled: !!currentUserId }
    );

    const voteComment = trpc.postComment.voteComment.useMutation();

    const userHasUpvoted = userVote?.vote_type === 'up';
    const userHasDownvoted = userVote?.vote_type === 'down';

    const handleVote = (voteType: 'up' | 'down') => {
        const currentVote = userVote?.vote_type;

        if (currentVote === voteType) {
            setVoteCount(prev => prev + (voteType === 'up' ? -1 : 1));
        } else if (currentVote === null || currentVote === undefined) {
            setVoteCount(prev => prev + (voteType === 'up' ? 1 : -1));
        } else {
            setVoteCount(prev => prev + (voteType === 'up' ? 2 : -2));
        }

        onVote(voteType);
    };

    return (
        <div className="buttons-group">
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    handleVote('up');
                }}
                disabled={!currentUserId || voteComment.isPending}
                aria-label="Upvote"
                className="action-btn__vote-button"
            >
                <AiOutlineLike
                    size={18}
                    className={userHasUpvoted ? 'active' : ''}
                />
            </button>
            <span className="action-btn__vote-count">{voteCount}</span>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    handleVote('down');
                }}
                disabled={!currentUserId || voteComment.isPending}
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
};

export const CommentButton = ({
    count,
    postId,
    asLink = true,
}: {
    count: number,
    postId?: string,
    asLink?: boolean,
}) => {
    const content = (
        <>
            <FaRegComment size={18} className="action-btn__icon" />
            <span className="action-btn__count">
                {count > 99 ? '99+' : count}
            </span>
        </>
    );

    if (asLink && postId) {
        return (
            <Link href={`/tea-room/${postId}`} className="buttons-group">
                {content}
            </Link>
        );
    }

    return <div className="buttons-group">{content}</div>;
};

export const ReplyButton = ({
    onClick,
}: {
    onClick: () => void,
}) => {
    return (
        <button className="buttons-group" onClick={onClick}>
            <FaRegComment size={18} className="action-btn__icon" />
            <span className="action-btn__text">Reply</span>
        </button>
    );
};

export const ShareButton = ({
    onClick,
}: {
    onClick?: () => void,
}) => {
    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onClick) {
            onClick();
        } else {
            console.log('Share clicked');
        }
    };

    return (
        <button className="buttons-group" onClick={handleClick}>
            <IoShareSocialSharp size={18} className="action-btn__icon" />
            <span className="action-btn__text">Share</span>
        </button>
    );
};

export const ActionsContainer = ({ children }: { children: React.ReactNode }) => {
    return <div className="actions-container">{children}</div>;
};

// Legacy export for backward compatibility
export const VoteButtons = PostVoteButtons;