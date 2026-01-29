'use client';

import '@/app/scss/components/ActionButtons.scss';
import { useState } from "react";
import { useSession } from 'next-auth/react';
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { AiOutlineLike, AiOutlineDislike } from "react-icons/ai";
import { FaRegCopy } from "react-icons/fa";
import { FaRegComment } from "react-icons/fa6";
import { IoShareSocialSharp } from "react-icons/io5";
import { useAuth } from '../../lib/hooks';
import { useFavorites, useToggleFavorite, useVotes, useToggleVote, useCommentButton, useCommentVote } from '../../lib/hooks';

export function FavoriteButton({
    quoteId,
    onRemoveFavorite,
}: {
    quoteId: string;
    onRemoveFavorite?: (quote_id: string) => void;
}) {
    const { isAuthenticated } = useAuth();

    // Server-side favorites (authenticated users)
    const { data: favoritesData } = useFavorites();
    const toggleFavoriteMutation = useToggleFavorite();

    // Local state for guest users (not persisted)
    const [guestFavorites, setGuestFavorites] = useState<Set<string>>(new Set());

    // Determine if this quote is favorited
    const isFavorited = isAuthenticated
        ? favoritesData?.favoriteIds.includes(quoteId) || false
        : guestFavorites.has(quoteId);

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();

        if (!isAuthenticated) {
            // Guest user - just toggle local state (instant, no server call)
            setGuestFavorites(prev => {
                const newSet = new Set(prev);
                if (newSet.has(quoteId)) {
                    newSet.delete(quoteId);
                } else {
                    newSet.add(quoteId);
                }
                return newSet;
            });
            return;
        }

        // If removing favorite and callback provided, call it
        if (isFavorited && onRemoveFavorite) {
            onRemoveFavorite(quoteId);
        }

        // Authenticated user - trigger mutation with optimistic update
        toggleFavoriteMutation.mutate({ quoteId: quoteId });
    };

    return (
        <button
            onClick={handleClick}
            className="action-btn__icon-only"
            aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
            disabled={toggleFavoriteMutation.isPending}
        >
            {isFavorited ? (
                <FaHeart size={18} className="action-btn__icon active" />
            ) : (
                <FaRegHeart size={18} className="action-btn__icon" />
            )}
        </button>
    );
}


// Backroll Card vote buttons
export function VoteButtons({
    quoteId,
    initialVoteCount = 0,
}: {
    quoteId: string,
    initialVoteCount?: number,
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

// Comment vote buttons
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

// Icon-only share button for BackrollCards
export function ShareButtonIcon() {
    return (
        <button className="action-btn__icon-only" aria-label="Share quote">
            <IoShareSocialSharp size={18} className="action-btn__icon" />
        </button>
    );
}

// Share button with text for Post Cards
export function ShareButton() {
    return (
        <button className="buttons-group" aria-label="Share quote">
            <IoShareSocialSharp size={18} className="action-btn__icon" />
            <span className="action-btn__text">Share</span>
        </button>
    );
}

export function CopyButton({ textToCopy }: { textToCopy: string }) {
    const handleCopy = async (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await navigator.clipboard.writeText(textToCopy);
            console.log('Quote copied to clipboard');
        } catch (error) {
            console.error('Failed to copy quote:', error);
        }
    };

    return (
        <button className="action-btn__icon-only" aria-label="Copy quote to clipboard" onClick={handleCopy}>
            <FaRegCopy size={16} className="action-btn__icon" />
        </button>
    );
}

export function CommentButton({
    onClick,
    quoteId
}: {
    onClick?: () => void,
    quoteId: string,
}) {
    const { data: commentCount = 0 } = useCommentButton(quoteId);

    return (
        <button
            className="buttons-group"
            aria-label={`${commentCount} comments - Click to view and comment`}
            onClick={onClick}
        >
            <FaRegComment size={18} className="action-btn__icon" />
            <span className="action-btn__count">
                {commentCount > 99 ? '99+' : commentCount}
            </span>
        </button>
    );
}

// Combined component for Share, Copy, and Favorite actions
export function ShareCopyFavoriteActions({
    quoteId,
    quoteText,
    onRemoveFavorite,
}: {
    quoteId: string;
    quoteText: string;
    onRemoveFavorite?: (quote_id: string) => void;
}) {
    return (
        <div className="buttons-group">
            <ShareButtonIcon />
            <CopyButton textToCopy={quoteText} />
            <FavoriteButton
                quoteId={quoteId}
                onRemoveFavorite={onRemoveFavorite}
            />
        </div>
    );
}

// Complete action buttons group for cards
export function QuoteActionButtons({
    quoteId,
    quoteText,
    initialVoteCount = 0,
    onCommentClick,
    onRemoveFavorite,
}: {
    quoteId: string;
    quoteText: string;
    initialVoteCount?: number;
    onCommentClick?: () => void;
    onRemoveFavorite?: (quote_id: string) => void;
}) {
    return (
        <div className="actions-container">
            <VoteButtons quoteId={quoteId} initialVoteCount={initialVoteCount} />
            <CommentButton onClick={onCommentClick} quoteId={quoteId} />
            <ShareCopyFavoriteActions
                quoteId={quoteId}
                quoteText={quoteText}
                onRemoveFavorite={onRemoveFavorite}
            />
        </div>
    );
}
