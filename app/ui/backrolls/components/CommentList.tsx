// components/backrolls/components/CommentList.tsx
'use client';

import { trpc } from '../../../lib/trpc';
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
        }
        user: { id: string; username: string };
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

    // For nested comments, fetch replies using the new procedure
    const { data: replies } = trpc.comments.getCommentReplies.useQuery(
        {
            parentCommentId: parentCommentId!
        },
        { enabled: depth > 0 && !!parentCommentId }
    );

    const displayComments = depth === 0 ? comments : (replies || []);

    return (
        <div className={`comment-list ${depth > 0 ? 'ml-8 border-l-2 border-gray-700 pl-4' : ''}`}>
            {displayComments.map((commentData) => (
                <CommentItem
                    key={commentData.comment.id}
                    comment={commentData.comment}
                    user={commentData.user}
                    replyCount={commentData.replyCount}
                    onReply={onReply}
                    depth={depth}
                />
            ))}
        </div>
    );
}