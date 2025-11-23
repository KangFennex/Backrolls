// components/backrolls/components/CommentForm.tsx
'use client';

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
            <div className="comment-login-prompt p-4 rounded-lg bg-gray-800 border border-gray-700">
                <p className="text-gray-300 text-center">
                    Please log in to join the discussion
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="comment-form">
            <div className="form-group">
                <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder={parentCommentId ? "Write your reply..." : "What are your thoughts about this quote?"}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-400 focus:ring-opacity-20 transition-all duration-200 resize-none"
                    rows={parentCommentId ? 3 : 4}
                    maxLength={1000}
                />
                <div className="flex justify-between items-center mt-3">
                    <div className="text-sm text-gray-400">
                        {commentText.length}/1000
                    </div>
                    <div className="flex gap-3">
                        {parentCommentId && (
                            <button
                                type="button"
                                onClick={onCancel}
                                className="px-4 py-2 text-gray-300 hover:text-white transition-colors duration-200"
                            >
                                Cancel
                            </button>
                        )}
                        <button
                            type="submit"
                            disabled={!commentText.trim() || createComment.isPending}
                            className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:from-pink-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
                        >
                            {createComment.isPending ? (
                                <span className="flex items-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Posting...
                                </span>
                            ) : (
                                parentCommentId ? 'Reply' : 'Post Comment'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
}