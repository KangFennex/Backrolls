'use client';

import '@/app/scss/components/CommentForm.scss';
import { useState } from 'react';
import { trpc } from '../../../lib/trpc';
import { useSession } from 'next-auth/react';

interface CommentFormProps {
    quoteId: string;
    parentCommentId?: string | null;
    onSuccess?: () => void;
    onCancel?: () => void;
    initialValue?: string;
}

export default function CommentForm({
    quoteId,
    parentCommentId = null,
    onSuccess,
    onCancel,
    initialValue = ''
}: CommentFormProps) {

    const [commentText, setCommentText] = useState(initialValue);
    const { data: session } = useSession();
    const utils = trpc.useContext();

    const createComment = trpc.comments.create.useMutation({
        onSuccess: () => {
            setCommentText('');
            utils.comments.getCommentsByQuoteId.invalidate({ id: quoteId });
            utils.comments.getCommentCount.invalidate({ quoteId });

            onSuccess?.();
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentText.trim() || !session) return;

        createComment.mutate({
            quoteId,
            parentCommentId,
            commentText: commentText.trim(),
        });
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

    return (
        <form onSubmit={handleSubmit} className="comment-form">
            <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder={parentCommentId ? "Write your reply..." : "What are your thoughts about this backroll?"}
                rows={parentCommentId ? 3 : 4}
                maxLength={1000}
                disabled={createComment.isPending}
            />
            
            <div className="comment-form__actions">
                <span className="char-count">
                    {commentText.length}/1,000
                </span>
                <div className="button-group">
                    {parentCommentId && (
                        <button
                            type="button"
                            onClick={onCancel}
                            className="btn btn--secondary btn--sm"
                            disabled={createComment.isPending}
                        >
                            Cancel
                        </button>
                    )}
                    <button
                        type="submit"
                        disabled={!commentText.trim() || createComment.isPending}
                        className="btn btn--primary btn--sm"
                    >
                        {createComment.isPending ? 'Posting...' : (parentCommentId ? 'Reply' : 'Comment')}
                    </button>
                </div>
            </div>
        </form>
    );
}