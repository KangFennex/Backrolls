'use client';

import { useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { AiOutlineLike, AiOutlineDislike } from "react-icons/ai";
import { FaRegCopy } from "react-icons/fa";
import { FaRegComment } from "react-icons/fa6";
import { IoShareSocialSharp } from "react-icons/io5";
import { useAuth } from '../../../lib/hooks';
import { useFavorites, useToggleFavorite, useVotes, useToggleVote, useCommentButton } from '../../../lib/hooks';

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

        console.log('quoteId value:', quoteId); // Add this
        console.log('quoteId type:', typeof quoteId); // Add this

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
            className="favorite-btn"
            aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
            disabled={toggleFavoriteMutation.isPending} // Prevent double-clicks
        >
            {isFavorited ? (
                <FaHeart size={18} className="favorite-icon filled text-pink-500 hover:scale-110 transition-all duration-300" />
            ) : (
                <FaRegHeart size={18} className="favorite-icon text-[#8a8a8a] hover:text-pink-500 hover:scale-110 transition-all duration-300" />
            )}
        </button>
    );
};

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
        <div className="flex rounded-full py-1 px-3 items-center justify-center gap-1 group-hover:bg-opacity-20 transition-all duration-300"
            aria-label="Vote buttons"
        >
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    handleVote('upvote');
                }}
                disabled={toggleVoteMutation.isPending}
                aria-label="Upvote"
            >
                <AiOutlineLike
                    size={18}
                    className={`upvote-icon hover:text-pink-500 hover:scale-[1.1] transition-all duration-300 ${userHasUpvoted ? 'text-pink-500' : 'text-[#8a8a8a]'}`}
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
                    size={18}
                    className={`downvote-icon hover:text-pink-500 hover:scale-[1.1] transition-all duration-300 ${userHasDownvoted ? 'text-pink-500' : 'text-[#8a8a8a]'}`}
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
            <IoShareSocialSharp size={18} className="hover:text-pink-500 hover:scale-[1.1] transition-all duration-300 text-[#8a8a8a]" />
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
            <FaRegCopy size={16} className="hover:text-pink-500 hover:scale-[1.1] transition-all duration-300 text-[#8a8a8a]" />
        </div>
    );
}

export function CommentButton({
    onClick,
    quoteId
}: {
    onClick?: () => void,
    quoteId: string,
}) {
    // Fetch comments for this quote
    const { data: commentCount = 0 } = useCommentButton(quoteId)

    return (
        <button
            className="comment-btn relative flex items-center justify-center transition-all duration-300 group"
            aria-label={`${commentCount} comments - Click to view and comment`}
            onClick={onClick}
        >
            <div className="flex rounded-full py-1 px-3 items-center justify-center gap-1 group-hover:bg-opacity-20 transition-all duration-300">
                <FaRegComment size={18} className="group-hover:text-pink-500 group-hover:scale-[1.1] transition-all duration-300 text-[#8a8a8a]" />
                <span className="text-md h-5 w-5 flex items-center justify-center font-medium group-hover:text-pink-500 transition-colors duration-300">
                    {commentCount > 99 ? '99+' : commentCount}
                </span>
            </div>
        </button>
    );
}