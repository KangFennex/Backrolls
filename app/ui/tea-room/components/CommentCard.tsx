'use client';

import { useState } from 'react';
import { trpc } from '@/app/lib/trpc';
import { CommentForm } from './CommentForm';

interface Comment {
    id: string;
    comment_text: string;
    user_id: string | null;
    created_at: string;
    updated_at: string;
    vote_count: number;
    reply_count: number;
    status: 'active' | 'deleted' | 'removed' | null;
    is_edited: boolean;
    edited_at: string | null;
    post_id: string;
    parent_comment_id: string | null;
    depth: number;
    is_removed: boolean;
    removed_at: string | null;
    removed_by: string | null;
    removal_reason: string | null;
    upvote_count: number;
    downvote_count: number;
}

interface CommentCardProps {
    comment: Comment;
    postId: string;
    depth?: number;
    currentUserId?: string;
}

export function CommentCard({ comment, postId, depth = 0, currentUserId }: CommentCardProps) {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [showReplies, setShowReplies] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editBody, setEditBody] = useState(comment.comment_text || '');

    const utils = trpc.useUtils();

    const { data: userVote } = trpc.postComment.getUserCommentVote.useQuery(
        { commentId: comment.id },
        { enabled: !!currentUserId }
    );

    const { data: replies, isLoading: repliesLoading } = trpc.postComment.getCommentReplies.useQuery(
        { commentId: comment.id },
        { enabled: showReplies && comment.reply_count > 0 }
    );

    const voteComment = trpc.postComment.voteComment.useMutation({
        onSuccess: () => {
            utils.postComment.getPostComments.invalidate();
            utils.postComment.getCommentReplies.invalidate();
            utils.postComment.getUserCommentVote.invalidate({ commentId: comment.id });
        }
    });

    const updateComment = trpc.postComment.updateComment.useMutation({
        onSuccess: () => {
            utils.postComment.getPostComments.invalidate();
            utils.postComment.getCommentReplies.invalidate();
            setIsEditing(false);
        }
    });

    const deleteComment = trpc.postComment.deleteComment.useMutation({
        onSuccess: () => {
            utils.postComment.getPostComments.invalidate();
            utils.postComment.getCommentReplies.invalidate();
        }
    });

    const handleVote = (voteType: 'up' | 'down') => {
        voteComment.mutate({ commentId: comment.id, voteType });
    };

    const handleUpdate = () => {
        if (!editBody.trim()) return;
        updateComment.mutate({
            commentId: comment.id,
            commentText: editBody.trim(),
        });
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this comment?')) {
            deleteComment.mutate({ commentId: comment.id });
        }
    };

    const formatDate = (date: string) => {
        const now = new Date();
        const diffInMinutes = Math.floor((now.getTime() - new Date(date).getTime()) / (1000 * 60));

        if (diffInMinutes < 1) return 'just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
        if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d ago`;
        return new Date(date).toLocaleDateString();
    };

    const isAuthor = currentUserId === comment.user_id;
    const canReply = depth < 10;

    return (
        <div className={`comment-card comment-card--depth-${Math.min(depth, 5)}`}>
            <div className="comment-card__vote-bar">
                <button
                    className={`vote-btn vote-btn--up ${userVote?.vote_type === 'up' ? 'vote-btn--active' : ''}`}
                    onClick={() => handleVote('up')}
                    disabled={!currentUserId || voteComment.isPending}
                    aria-label="Upvote"
                >
                    ▲
                </button>
                <span className="vote-count">{comment.vote_count}</span>
                <button
                    className={`vote-btn vote-btn--down ${userVote?.vote_type === 'down' ? 'vote-btn--active' : ''}`}
                    onClick={() => handleVote('down')}
                    disabled={!currentUserId || voteComment.isPending}
                    aria-label="Downvote"
                >
                    ▼
                </button>
            </div>

            <div className="comment-card__content">
                <div className="comment-card__meta">
                    <span className="comment-card__author">
                        {comment.status === 'deleted' ? '[deleted]' : '[user]'}
                    </span>
                    <span className="comment-card__date">{formatDate(comment.created_at)}</span>
                    {comment.is_edited && (
                        <span className="comment-card__edited">(edited)</span>
                    )}
                </div>

                {comment.status === 'deleted' ? (
                    <div className="comment-card__body comment-card__body--deleted">
                        [This comment has been deleted]
                    </div>
                ) : isEditing ? (
                    <div className="comment-card__edit">
                        <textarea
                            value={editBody}
                            onChange={(e) => setEditBody(e.target.value)}
                            rows={3}
                            maxLength={10000}
                        />
                        <div className="button-group">
                            <button
                                className="btn btn--secondary btn--sm"
                                onClick={() => {
                                    setIsEditing(false);
                                    setEditBody(comment.comment_text || '');
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn--primary btn--sm"
                                onClick={handleUpdate}
                                disabled={updateComment.isPending || !editBody.trim()}
                            >
                                {updateComment.isPending ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="comment-card__body">{comment.comment_text}</div>
                )}

                {comment.status !== 'deleted' && (
                    <div className="comment-card__actions">
                        {canReply && currentUserId && (
                            <button
                                className="action-btn"
                                onClick={() => setShowReplyForm(!showReplyForm)}
                            >
                                Reply
                            </button>
                        )}
                        {isAuthor && !isEditing && (
                            <>
                                <button
                                    className="action-btn"
                                    onClick={() => setIsEditing(true)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="action-btn action-btn--danger"
                                    onClick={handleDelete}
                                    disabled={deleteComment.isPending}
                                >
                                    Delete
                                </button>
                            </>
                        )}
                        {comment.reply_count > 0 && (
                            <button
                                className="action-btn"
                                onClick={() => setShowReplies(!showReplies)}
                            >
                                {showReplies ? 'Hide' : 'Show'} {comment.reply_count} {comment.reply_count === 1 ? 'reply' : 'replies'}
                            </button>
                        )}
                    </div>
                )}

                {showReplyForm && currentUserId && (
                    <div className="comment-card__reply-form">
                        <CommentForm
                            postId={postId}
                            parentCommentId={comment.id}
                            onSuccess={() => setShowReplyForm(false)}
                            onCancel={() => setShowReplyForm(false)}
                            placeholder="Write a reply..."
                        />
                    </div>
                )}

                {showReplies && comment.reply_count > 0 && (
                    <div className="comment-card__replies">
                        {repliesLoading ? (
                            <div className="loading-spinner">Loading replies...</div>
                        ) : (
                            replies?.map((reply) => (
                                <CommentCard
                                    key={reply.id}
                                    comment={reply}
                                    postId={postId}
                                    depth={depth + 1}
                                    currentUserId={currentUserId}
                                />
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
