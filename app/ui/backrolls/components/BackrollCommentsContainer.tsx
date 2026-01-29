// components/backrolls/components/BackrollCommentsContainer.tsx
'use client';

import '@/app/scss/components/Skeleton.scss';
import { useState } from 'react';
import { trpc } from '../../../lib/trpc';
import CommentList from './CommentList';
import CommentForm from './CommentForm';
import { useCommentButton } from '../../../lib/hooks/useCommentButton';

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

    // Fetch total comments count for this quote
    const { data: commentCount = 0 } = useCommentButton(quoteId);

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
                <h2 className="text-xl font-bold text-white">
                    Comments {commentCount && `(${commentCount})`}
                </h2>
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
                <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="sk-card" style={{ padding: '0.75rem' }}>
                            <div className="sk sk--text-lg" style={{ width: '30%', marginBottom: '0.5rem' }} />
                            <div className="sk sk--text" style={{ width: '90%', marginBottom: '0.25rem' }} />
                            <div className="sk sk--text" style={{ width: '70%' }} />
                        </div>
                    ))}
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