'use client';

import '@/app/scss/components/CommentForm.scss';
import { useState } from 'react';
import { useCreateComment } from '../../../lib/hooks/useCreateComment';
import { useUpdateComment } from '../../../lib/hooks/useUpdateComment';
import { useSession } from 'next-auth/react';
import type { Session } from 'next-auth';

interface CommentFormProps {
    commentId?: string;
    quoteId: string;
    parentCommentId?: string | null;
    onSuccess?: () => void;
    onCancel?: () => void;
    initialValue?: string;
    isEditing?: boolean;
}

export default function CommentForm({
    commentId,
    quoteId,
    parentCommentId = null,
    onSuccess,
    onCancel,
    initialValue = '',
    isEditing = false,
}: CommentFormProps) {

    const [commentText, setCommentText] = useState(initialValue);
    const { data: session } = useSession();
    const userId = (session as Session | null)?.user?.id;
    const username = (session as Session | null)?.user?.username ?? session?.user?.name ?? 'You';

    const createComment = useCreateComment({
        quoteId,
        parentCommentId,
        currentUser: userId
            ? {
                id: userId,
                username,
            }
            : null,
        onSuccess: () => {
            setCommentText('');
            onSuccess?.();
        },
    });

    const updateComment = useUpdateComment({
        quoteId,
        parentCommentId,
        onSuccess: () => {
            onSuccess?.();
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentText.trim() || !session) return;

        if (isEditing && commentId) {
            updateComment.mutate({
                commentId,
                commentText: commentText.trim(),
            });
        } else {
            createComment.mutate({
                quoteId,
                parentCommentId,
                commentText: commentText.trim(),
            });
        }
    };

    if (!session) {
        return (
            <div className="comment-login-prompt">
                <p>
                    Please log in to join the discussion
                </p>
            </div>
        );
    }

    const isPending = isEditing ? updateComment.isPending : createComment.isPending;

    return (
        <form onSubmit={handleSubmit} className="comment-form">
            <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder={isEditing ? "Edit your comment..." : (parentCommentId ? "Write your reply..." : "What are your thoughts about this backroll?")}
                rows={isEditing || parentCommentId ? 3 : 4}
                maxLength={1000}
                disabled={isPending}
            />

            <div className="comment-form__actions">
                <span className="char-count">
                    {commentText.length}/1,000
                </span>
                <div className="button-group">
                    {(parentCommentId || isEditing) && (
                        <button
                            type="button"
                            onClick={onCancel}
                            className="btn btn--secondary btn--sm"
                            disabled={isPending}
                        >
                            Cancel
                        </button>
                    )}
                    <button
                        type="submit"
                        disabled={!commentText.trim() || isPending}
                        className="btn btn--primary btn--sm"
                    >
                        {isPending ? (isEditing ? 'Saving...' : 'Posting...') : (isEditing ? 'Save' : (parentCommentId ? 'Reply' : 'Comment'))}
                    </button>
                </div>
            </div>
        </form>
    );
}