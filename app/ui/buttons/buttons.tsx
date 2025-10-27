'use client';

import { FaHeart, FaRegHeart } from "react-icons/fa";
import { AiOutlineLike, AiOutlineDislike } from "react-icons/ai";
import { FaRegCopy } from "react-icons/fa";
import { IoShareSocialSharp, IoAddCircleOutline, IoAddCircleSharp } from "react-icons/io5";
import { useBackrollsStore } from '../../store/backrollsStore';
import { useAuth } from '../../lib/hooks';

export function FavoriteButton({
    quote_id,
    onRemoveFavorite
}: {
    quote_id: string,
    onRemoveFavorite?: (quote_id: string) => void
}) {
    const { isAuthenticated } = useAuth();
    const { favorites, toggleFavorite } = useBackrollsStore();

    const handleClick = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isAuthenticated) {
            console.log('User not authenticated. Cannot favorite backroll.');
            return;
        }
        const wasFavorited = favorites.includes(quote_id);

        await toggleFavorite(quote_id);
        console.log("About to remove quote from UI")
        if (wasFavorited && onRemoveFavorite) {
            onRemoveFavorite(quote_id);
        }
    };

    return (
        <button onClick={handleClick} className="favorite-btn" aria-label={favorites.includes(quote_id) ? "Remove from favorites" : "Add to favorites"}
        >
            {favorites.includes(quote_id) ? (
                <FaHeart className="favorite-icon text-1xl filled text-pink-500 hover:scale-110 transition-all duration-300" />
            ) : (
                <FaRegHeart className="favorite-icon text-1xl hover:text-pink-500 hover:scale-110 transition-all duration-300" />
            )}
        </button>
    )
};

export function VoteButtons({
    quote_id,
    currentVoteCount
}: {
    quote_id: string,
    currentVoteCount?: number
}) {
    const { upvote, downvote, hasUpvoted, hasDownvoted, getVoteCount } = useBackrollsStore();

    const voteCount = currentVoteCount ?? getVoteCount(quote_id);
    const userHasUpvoted = hasUpvoted(quote_id);
    const userHasDownvoted = hasDownvoted(quote_id);

    return (
        <div>
            {
                <div className="vote-buttons flex gap-2 px-2">
                    <AiOutlineLike
                        size={20}
                        className={`upvote-icon  hover:text-pink-500 hover:scale-110 transition-all duration-300 ${userHasUpvoted ? 'text-pink-500' : ''}`}
                        onClick={() => upvote(quote_id)}
                    />
                    <span className="vote-count text-sm select-none">{voteCount}</span>
                    <AiOutlineDislike
                        size={20}
                        className={`downvote-icon hover:text-pink-500 hover:scale-110 transition-all duration-300 ${userHasDownvoted ? 'text-pink-500' : ''}`}
                        onClick={() => downvote(quote_id)}
                    />
                </div>
            }
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