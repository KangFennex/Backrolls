'use client';

import { trpc } from '@/app/lib/trpc';
import { CommentCard } from './CommentCard';

interface CommentListProps {
    postId: string;
    parentCommentId: string;
    depth?: number;
    currentUserId?: string;
}

export default function CommentList({
    postId,
    parentCommentId,
    depth = 0,
    currentUserId
}: CommentListProps) {
    const { data: replies, isLoading } = trpc.postComment.getCommentReplies.useQuery(
        { commentId: parentCommentId }
    );

    if (isLoading) {
        return <div className="loading-spinner">Loading replies...</div>;
    }

    if (!replies || replies.length === 0) {
        return null;
    }

    return (
        <div className={`comment-list ${depth > 0 ? 'comment-list--nested' : ''}`}>
            {replies.map((comment) => (
                <div key={comment.id} className="comment-list__item">
                    <CommentCard
                        comment={comment}
                        postId={postId}
                        depth={depth}
                        currentUserId={currentUserId}
                    />
                </div>
            ))}
        </div>
    );
}