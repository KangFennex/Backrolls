'use client';

import { useState } from 'react';
import { trpc } from '@/app/lib/trpc';

interface CommentFormProps {
    postId: string;
    parentCommentId?: string;
    onSuccess?: () => void;
    onCancel?: () => void;
    placeholder?: string;
}

export function CommentForm({ postId, parentCommentId, onSuccess, onCancel, placeholder }: CommentFormProps) {
    const [body, setBody] = useState('');
    const [error, setError] = useState('');

    const utils = trpc.useUtils();
    const createComment = trpc.postComment.createComment.useMutation({
        onSuccess: () => {
            utils.postComment.getPostComments.invalidate({ postId });
            if (parentCommentId) {
                utils.postComment.getCommentReplies.invalidate({ parentCommentId });
            }
            utils.post.getPost.invalidate({ postId });
            setBody('');
            setError('');
            onSuccess?.();
        },
        onError: (err) => {
            setError(err.message);
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!body.trim()) {
            setError('Comment cannot be empty');
            return;
        }

        if (body.length > 10000) {
            setError('Comment must be 10,000 characters or less');
            return;
        }

        createComment.mutate({
            postId,
            body: body.trim(),
            parentCommentId,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="comment-form">
            {error && <div className="form-error">{error}</div>}
            
            <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder={placeholder || 'What are your thoughts?'}
                rows={3}
                maxLength={10000}
                disabled={createComment.isPending}
            />

            <div className="comment-form__actions">
                <span className="char-count">{body.length}/10,000</span>
                <div className="button-group">
                    {onCancel && (
                        <button
                            type="button"
                            className="btn btn--secondary btn--sm"
                            onClick={onCancel}
                            disabled={createComment.isPending}
                        >
                            Cancel
                        </button>
                    )}
                    <button
                        type="submit"
                        className="btn btn--primary btn--sm"
                        disabled={createComment.isPending || !body.trim()}
                    >
                        {createComment.isPending ? 'Posting...' : 'Comment'}
                    </button>
                </div>
            </div>
        </form>
    );
}
