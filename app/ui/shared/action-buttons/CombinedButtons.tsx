'use client';

import '@/app/scss/components/ActionButtons.scss';
import { VoteButtons } from './VoteButtons';
import { CommentButton } from './CommentButtons';
import { ShareButtonIcon } from './ShareButtons';
import { CopyButton } from './CopyButton';
import { FavoriteButton } from './FavoriteButton';

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

// Complete action buttons group for quote cards
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
