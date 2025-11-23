// components/backrolls/components/BackrollCommentsContainer.tsx
'use client';

import { useState } from 'react';
import { trpc } from '../../../lib/trpc';
import CommentList from './CommentList';
import CommentForm from './CommentForm';

interface BackrollCommentsContainerProps {
    children?: React.ReactNode;
    quoteId?: string;
}

export default function BackrollCommentsContainer({
    children,
    quoteId
}: BackrollCommentsContainerProps) {
    const [replyingTo, setReplyingTo] = useState<string | null>(null);

    // Fetch comments for this quote
    const { data: comments, isLoading, error } = trpc.comments.getCommentsByQuoteId.useQuery(
        { id: quoteId! },
        { enabled: !!quoteId }
    );

    if (!quoteId) {
        return (
            <div className="comments-container">
                <div className="text-center py-8 text-gray-400">
                    Select a quote to view comments
                </div>
            </div>
        );
    }

    return (
        <div className="comments-container mt-8">
            {/* Header */}
            <div className="comments-header mb-6">
                <h2 className="text-2xl font-bold text-white">
                    Comments {comments && `(${comments.length})`}
                </h2>
                <p className="text-gray-400 mt-2">
                    Join the discussion about this quote
                </p>
            </div>

            {/* Comment Form */}
            <div className="comment-form-section mb-8">
                <CommentForm
                    quoteId={quoteId}
                    parentCommentId={replyingTo}
                    onSuccess={() => setReplyingTo(null)}
                    onCancel={() => setReplyingTo(null)}
                />
            </div>

            {/* Comments List */}
            {isLoading ? (
                <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-400"></div>
                    <p className="text-gray-400 mt-2">Loading comments...</p>
                </div>
            ) : error ? (
                <div className="text-center py-8 text-red-400">
                    Failed to load comments
                </div>
            ) : comments && comments.length > 0 ? (
                <CommentList
                    comments={comments}
                    onReply={setReplyingTo}
                />
            ) : (
                <div className="text-center py-12 border-2 border-dashed border-gray-700 rounded-lg">
                    <div className="text-4xl mb-4">💬</div>
                    <h3 className="text-xl font-semibold text-white mb-2">No comments yet</h3>
                    <p className="text-gray-400">Be the first to share your thoughts!</p>
                </div>
            )}

            {children}
        </div>
    );
}