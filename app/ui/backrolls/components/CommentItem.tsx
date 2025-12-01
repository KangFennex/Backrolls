'use client';

import { useState } from 'react';
import { trpc } from '../../../lib/trpc';
import { useSession } from 'next-auth/react';
import CommentVoteButtons from './CommentVoteButtons';
import CommentForm from './CommentForm';
import CommentList from './CommentList';
import { formatDistanceToNow } from 'date-fns';

interface CommentItemProps {
    comment: {
        id: string;
        comment_text: string;
        user_id: string;
        quote_id: string;
        parent_comment_id?: string | null;
        created_at: string;
        is_edited: boolean;
        vote_count: number;
    };
    user: { id: string; username: string } | null;
    replyCount: number;
    onReply: (commentId: string) => void;
    depth: number;
}

export default function CommentItem({
    comment,
    user,
    replyCount,
    onReply,
    depth
}: CommentItemProps) {
    const [showReplies, setShowReplies] = useState(false);
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const { data: session } = useSession();
    const utils = trpc.useContext();

    const userId = (session as { user?: { id?: string } } | null | undefined)?.user?.id;
    const isOwner = userId === comment.user_id;
    const maxDepth = 4; // Prevent infinite nesting

    const deleteComment = trpc.comments.delete.useMutation({
        onSuccess: () => {
            utils.comments.getCommentsByQuoteId.invalidate({ id: comment.quote_id });
            utils.comments.getCommentCount.invalidate({ quoteId: comment.quote_id });

            // Also invalidate the parent comment's replies
            if (comment.parent_comment_id) {
                utils.comments.getCommentReplies.invalidate({ parentCommentId: comment.parent_comment_id });
            }
        },
    });

    const handleReply = () => {
        if (depth >= maxDepth) {
            // Optionally show a message about max depth
            return;
        }
        setShowReplyForm(true);
        onReply(comment.id);
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this comment?')) {
            deleteComment.mutate({ commentId: comment.id });
        }
    };

    return (
        <div className="comment-item group bg-gray-800 rounded-lg p-4 mb-4 border border-gray-700 hover:border-gray-600 transition-all duration-200">
            {/* Comment Header */}
            <div className="comment-header flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                    {/* User Avatar - Placeholder for future implementation */}
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 flex items-center justify-center text-white text-sm font-bold">
                        {user?.username?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div>
                        <span className="font-medium text-white">{user?.username || 'Unknown User'}</span>
                        <span className="text-gray-400 text-sm ml-2">
                            {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                            {comment.is_edited && ' · edited'}
                        </span>
                    </div>
                </div>

                {/* Comment Actions */}
                {isOwner && (
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                            onClick={() => setIsEditing(true)}
                            className="text-gray-400 hover:text-pink-400 text-sm mr-3"
                        >
                            Edit
                        </button>
                        <button
                            onClick={handleDelete}
                            className="text-gray-400 hover:text-red-400 text-sm"
                            disabled={deleteComment.isPending}
                        >
                            {deleteComment.isPending ? 'Deleting...' : 'Delete'}
                        </button>
                    </div>
                )}
            </div>

            {/* Comment Content */}
            {isEditing ? (
                <CommentForm
                    quoteId={comment.quote_id}
                    parentCommentId={comment.parent_comment_id}
                    initialValue={comment.comment_text}
                    onSuccess={() => setIsEditing(false)}
                    onCancel={() => setIsEditing(false)}
                />
            ) : (
                <div className="comment-content mb-3">
                    <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">
                        {comment.comment_text}
                    </p>
                </div>
            )}

            {/* Comment Footer */}
            <div className="comment-footer flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <CommentVoteButtons
                        commentId={comment.id}
                        initialVoteCount={comment.vote_count}
                    />

                    <button
                        onClick={handleReply}
                        className="text-gray-400 hover:text-pink-400 text-sm font-medium transition-colors duration-200"
                        disabled={depth >= maxDepth}
                    >
                        Reply
                    </button>
                </div>

                {/* Show Replies Toggle */}
                {replyCount > 0 && (
                    <button
                        onClick={() => setShowReplies(!showReplies)}
                        className="text-pink-400 hover:text-pink-300 text-sm font-medium transition-colors duration-200 flex items-center gap-1"
                    >
                        {showReplies ? 'Hide' : 'Show'} {replyCount} {replyCount === 1 ? 'reply' : 'replies'}
                    </button>
                )}
            </div>

            {/* Reply Form */}
            {showReplyForm && (
                <div className="mt-4 ml-4">
                    <CommentForm
                        quoteId={comment.quote_id}
                        parentCommentId={comment.id}
                        onSuccess={() => setShowReplyForm(false)}
                        onCancel={() => setShowReplyForm(false)}
                    />
                </div>
            )}

            {/* Nested Replies */}
            {showReplies && replyCount > 0 && depth < maxDepth && (
                <div className="mt-4">
                    <CommentList
                        comments={[]} // Will be fetched by the CommentList component
                        onReply={onReply}
                        parentCommentId={comment.id}
                        depth={depth + 1}
                    />
                </div>
            )}
        </div>
    );
}