'use client';

import { useCommentReplies } from '../../../lib/hooks/useCommentReplies';
import CommentItem from './CommentItem';

interface CommentListProps {
    comments: Array<{
        comment: {
            id: string;
            comment_text: string;
            user_id: string;
            quote_id: string;
            parent_comment_id?: string | null;
            created_at: string;
            is_edited: boolean;
            vote_count: number;
        }
        user: { id: string; username: string } | null;
        replyCount: number;
    }>;
    onReply: (commentId: string) => void;
    parentCommentId?: string | null;
    depth?: number;
}

export default function CommentList({
    comments,
    onReply,
    parentCommentId = null,
    depth = 0
}: CommentListProps) {

    // For nested comments, fetch replies using the new hook
    const { data: replies } = useCommentReplies(
        parentCommentId,
        30
    );

    const displayComments = depth === 0 ? comments : (replies || []);

    return (
        <div className={`comment-list ${depth > 0 ? 'comment-list--nested' : ''}`}>
            {displayComments.map((commentData) => (
                <div key={commentData.comment.id} className="comment-list__item">
                    <CommentItem
                        comment={commentData.comment}
                        user={commentData.user}
                        replyCount={commentData.replyCount}
                        onReply={onReply}
                        depth={depth}
                    />
                </div>
            ))}
        </div>
    );
}