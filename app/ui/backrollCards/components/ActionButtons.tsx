'use client';

import { useState, useEffect } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { AiOutlineLike, AiOutlineDislike } from "react-icons/ai";
import { FaRegCopy } from "react-icons/fa";
import { FaRegComment } from "react-icons/fa6";
import { IoShareSocialSharp } from "react-icons/io5";
import { useAuth } from '../../../lib/hooks';
import { useFavorites, useToggleFavorite, useVotes, useToggleVote } from '../../../lib/hooks';

export function FavoriteButton({
    quote_id,
}: {
    quote_id: string,
}) {
    const { isAuthenticated } = useAuth();

    // Server-side favorites (authenticated users)
    const { data: favoritesData } = useFavorites();
    const toggleFavoriteMutation = useToggleFavorite();

    // Local state for guest users (not persisted)
    const [guestFavorites, setGuestFavorites] = useState<Set<string>>(new Set());

    // Determine if this quote is favorited
    const isFavorited = isAuthenticated
        ? favoritesData?.favoriteIds.includes(quote_id) || false
        : guestFavorites.has(quote_id);

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();

        if (!isAuthenticated) {
            // Guest user - just toggle local state (instant, no server call)
            setGuestFavorites(prev => {
                const newSet = new Set(prev);
                if (newSet.has(quote_id)) {
                    newSet.delete(quote_id);
                } else {
                    newSet.add(quote_id);
                }
                return newSet;
            });
            return;
        }

        // Authenticated user - trigger mutation with optimistic update
        toggleFavoriteMutation.mutate({ quoteId: quote_id });
    };

    return (
        <button
            onClick={handleClick}
            className="favorite-btn"
            aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
            disabled={toggleFavoriteMutation.isPending} // Prevent double-clicks
        >
            {isFavorited ? (
                <FaHeart className="favorite-icon text-1xl filled text-pink-500 hover:scale-110 transition-all duration-300" />
            ) : (
                <FaRegHeart className="favorite-icon text-1xl hover:text-pink-500 hover:scale-110 transition-all duration-300" />
            )}
        </button>
    );
};

export function VoteButtons({
    quote_id,
    initialVoteCount = 0,
}: {
    quote_id: string,
    initialVoteCount?: number,
}) {
    const { isAuthenticated } = useAuth();

    // Get user's vote status from server
    const { data: votesData } = useVotes();
    const toggleVoteMutation = useToggleVote();

    // Local state for vote count (starts with quote's vote_count, updates from server)
    const [displayVoteCount, setDisplayVoteCount] = useState(initialVoteCount);

    // Local state for guest users (not persisted)
    const [guestVote, setGuestVote] = useState<'upvote' | 'downvote' | null>(null);

    // Determine user's vote status
    const userVote = isAuthenticated
        ? votesData?.votes.find(v => v.quote_id === quote_id)
        : null;

    const userHasUpvoted = isAuthenticated
        ? userVote?.vote_type === 'upvote'
        : guestVote === 'upvote';

    const userHasDownvoted = isAuthenticated
        ? userVote?.vote_type === 'downvote'
        : guestVote === 'downvote';

    // Listen for vote count updates from server
    useEffect(() => {
        const handleVoteUpdate = (event: Event) => {
            const customEvent = event as CustomEvent;
            if (customEvent.detail.quoteId === quote_id) {
                setDisplayVoteCount(customEvent.detail.newVoteCount);
            }
        };

        window.addEventListener('voteUpdated', handleVoteUpdate);
        return () => window.removeEventListener('voteUpdated', handleVoteUpdate);
    }, [quote_id]);

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
        toggleVoteMutation.mutate({ quoteId: quote_id, voteType });
    };

    return (
        <div className="vote-buttons flex gap-2 px-2">
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    handleVote('upvote');
                }}
                disabled={toggleVoteMutation.isPending}
                aria-label="Upvote"
            >
                <AiOutlineLike
                    size={20}
                    className={`upvote-icon hover:text-pink-500 hover:scale-110 transition-all duration-300 ${userHasUpvoted ? 'text-pink-500' : ''}`}
                />
            </button>

            <span className="vote-count text-sm select-none">{displayVoteCount}</span>

            <button
                onClick={(e) => {
                    e.stopPropagation();
                    handleVote('downvote');
                }}
                disabled={toggleVoteMutation.isPending}
                aria-label="Downvote"
            >
                <AiOutlineDislike
                    size={20}
                    className={`downvote-icon hover:text-pink-500 hover:scale-110 transition-all duration-300 ${userHasDownvoted ? 'text-pink-500' : ''}`}
                />
            </button>
        </div>
    );
};

export function ShareButton() {
    /*     const handleShare = async () => {
            if (navigator.share) {
                try {
                    await navigator.share({
                        title: 'Check out this quote on Backrolls!',
                        url: window.location.href,
                    });
                    console.log('Quote shared successfully');
                } catch (error) {
                    console.error('Error sharing quote:', error);
                }
            } else {
                console.warn('Web Share API not supported in this browser.');
            }
        }; */

    return (
        <div className="share-btn" aria-label="Share quote">
            <IoShareSocialSharp size={20} className="hover:text-pink-500 hover:scale-110 transition-all duration-300" />
        </div>
    );
}

export function CopyButton({ textToCopy }: { textToCopy: string }) {

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(textToCopy);
            console.log('Quote copied to clipboard');
        } catch (error) {
            console.error('Failed to copy quote:', error);
        }
    };

    return (
        <div className="copy-btn pb-1" aria-label="Copy quote to clipboard" onClick={handleCopy}>
            <FaRegCopy size={17} className="hover:text-pink-500 hover:scale-110 transition-all duration-300" />
        </div>
    );
}

export function CommentButton() {
    return (
        <div className="comment-btn" aria-label="Comment on quote">
            <FaRegComment size={17} className="hover:text-pink-500 hover:scale-110 transition-all duration-300" />
        </div>
    );
}