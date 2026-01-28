'use client';

import { trpc } from '@/app/lib/trpc';
import { CommentCard } from './CommentCard';
import { CommentForm } from './CommentForm';
import '@/app/scss/pages/tea-room/CommentSection.scss';
import '@/app/scss/components/CommentItem.scss';

interface CommentSectionProps {
    postId: string;
    currentUserId?: string;
}

export function CommentSection({ postId, currentUserId }: CommentSectionProps) {
    const { data: comments, isLoading, error } = trpc.postComment.getPostComments.useQuery({ postId });

    if (isLoading) {
        return (
            <div className="comment-section">
                <div className="loading-spinner">Loading comments...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="comment-section">
                <div className="error-message">Failed to load comments: {error.message}</div>
            </div>
        );
    }

    return (
        <div className="comment-section">
            <h3 className="comment-section__title">
                Comments ({comments?.length || 0})
            </h3>

            {currentUserId ? (
                <div className="comment-section__form">
                    <CommentForm postId={postId} placeholder="Add a comment..." />
                </div>
            ) : (
                <div className="comment-section__login-prompt">
                    Please log in to comment
                </div>
            )}

            <div className="comment-section__list">
                {comments && comments.length > 0 ? (
                    comments.map((comment) => (
                        <CommentCard
                            key={comment.id}
                            comment={comment}
                            postId={postId}
                            currentUserId={currentUserId}
                        />
                    ))
                ) : (
                    <div className="comment-section__empty">
                        No comments yet. Be the first to comment!
                    </div>
                )}
            </div>
        </div>
    );
}
