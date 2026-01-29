'use client';

import '@/app/scss/components/ActionButtons.scss';
import { FaRegComment } from 'react-icons/fa6';
import { useCommentButton, usePostCommentButton } from '../../../lib/hooks';

// Comment button for quotes (displays count)
export function CommentButton({
    onClick,
    quoteId,
}: {
    onClick?: () => void;
    quoteId: string;
}) {
    const { data: commentCount = 0 } = useCommentButton(quoteId || '');

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

// Post comment button (displays count, links to post)
export function PostCommentButton({
    postId,
}: {
    postId?: string;
}) {

    const { data: count = 0 } = usePostCommentButton(postId || '');

    return (
        <button
            className="buttons-group"
            aria-label={`${count} comments - Click to view and comment`}
        >
            <FaRegComment size={18} className="action-btn__icon" />
            <span className="action-btn__count">
                {count > 99 ? '99+' : count}
            </span>
        </button>
    );
}

// Reply button (for comment threads)
export function ReplyButton({
    onClick,
}: {
    onClick: () => void;
}) {
    return (
        <button className="buttons-group" onClick={onClick}>
            <FaRegComment size={18} className="action-btn__icon" />
            <span className="action-btn__text">Reply</span>
        </button>
    );
}
