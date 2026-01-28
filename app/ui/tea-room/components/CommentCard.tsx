'use client';

import '@/app/scss/components/DropdownMenu.scss';
import { useState, useRef, useEffect } from 'react';
import { trpc } from '@/app/lib/trpc';
import { CommentForm } from './CommentForm';
import { formatDate } from '@/app/lib/utils';
import { createPortal } from 'react-dom';
import { CommentVoteButtons, ReplyButton, ActionsContainer } from './ActionButtons';
import { BsThreeDots } from "react-icons/bs";
import { MdDataSaverOn } from "react-icons/md";
import { BiHide } from "react-icons/bi";
import { MdReportGmailerrorred } from "react-icons/md";
import { MdDelete, MdEdit } from "react-icons/md";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";

interface Comment {
    id: string;
    comment_text: string;
    user_id: string | null;
    username: string | null;
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
    const [showReplies, setShowReplies] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editBody, setEditBody] = useState(comment.comment_text || '');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
    const menuButtonRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const [voteCount, setVoteCount] = useState(comment.vote_count);

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

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node) &&
                menuButtonRef.current &&
                !menuButtonRef.current.contains(event.target as Node)
            ) {
                setIsMenuOpen(false);
            }
        };

        if (isMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMenuOpen]);

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
        const currentVote = userVote?.vote_type;

        // Optimistic UI update
        if (currentVote === voteType) {
            // Remove vote
            setVoteCount(prev => prev + (voteType === 'up' ? -1 : 1));
        } else if (currentVote === null || currentVote === undefined) {
            // Add vote
            setVoteCount(prev => prev + (voteType === 'up' ? 1 : -1));
        } else {
            // Switch vote
            setVoteCount(prev => prev + (voteType === 'up' ? 2 : -2));
        }

        voteComment.mutate({ commentId: comment.id, voteType });
    };

    const handleMenuToggle = (e: React.MouseEvent) => {
        e.stopPropagation();

        if (!isMenuOpen && menuButtonRef.current) {
            const rect = menuButtonRef.current.getBoundingClientRect();
            setMenuPosition({
                top: rect.bottom + 4,
                left: rect.right - 140,
            });
        }

        setIsMenuOpen(!isMenuOpen);
    };

    const handleMenuAction = (action: string, e: React.MouseEvent) => {
        e.stopPropagation();
        console.log(`${action} comment:`, comment.id);
        setIsMenuOpen(false);
    };

    const handleUpdate = () => {
        if (!editBody.trim()) return;
        updateComment.mutate({
            commentId: comment.id,
            commentText: editBody.trim(),
        });
    };

    const handleDelete = async (e?: React.MouseEvent) => {
        if (e) {
            e.stopPropagation();
        }

        if (!confirm('Are you sure you want to delete this comment? This action cannot be undone.')) {
            return;
        }

        setIsMenuOpen(false);

        try {
            await deleteComment.mutateAsync({ commentId: comment.id });
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    const isAuthor = currentUserId === comment.user_id;
    const canReply = depth < 10;

    const Menu = () => {
        if (typeof window === 'undefined') return null;

        return createPortal(
            <div
                ref={menuRef}
                className="post-card__dropdown"
                style={{
                    position: 'fixed',
                    top: `${menuPosition.top}px`,
                    left: `${menuPosition.left}px`,
                }}
            >
                <span className="post-card__dropdown-item">
                    <MdDataSaverOn size={18} />
                    <button onClick={(e) => handleMenuAction('Save', e)}>
                        Save
                    </button>
                </span>
                <span className="post-card__dropdown-item">
                    <BiHide size={18} />
                    <button onClick={(e) => handleMenuAction('Hide', e)}>
                        Hide
                    </button>
                </span>
                <span className="post-card__dropdown-item">
                    <MdReportGmailerrorred size={18} />
                    <button onClick={(e) => handleMenuAction('Report', e)}>
                        Report
                    </button>
                </span>
                {isAuthor && (
                    <>
                        <span className="post-card__dropdown-item">
                            <MdEdit size={18} />
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsEditing(true);
                                    setIsMenuOpen(false);
                                }}
                            >
                                Edit
                            </button>
                        </span>
                        <span className="post-card__dropdown-item post-card__dropdown-item--danger">
                            <MdDelete size={18} />
                            <button
                                onClick={handleDelete}
                                disabled={deleteComment.isPending}
                            >
                                {deleteComment.isPending ? 'Deleting...' : 'Delete'}
                            </button>
                        </span>
                    </>
                )}
            </div>,
            document.body
        );
    };

    return (
        <div className={`comment-item comment-item--depth-${Math.min(depth, 5)}`}>

            <div className="comment-item__content">
                <div className="comment-item__meta">
                    <div>
                        <span className="comment-item__username">
                            {comment.username ? comment.username : 'Deleted User'}
                        </span>
                        <span className="comment-item__date">{formatDate(comment.created_at)}</span>
                        {comment.is_edited && (
                            <span className="comment-item__edited">(edited)</span>
                        )}
                    </div>
                    <div className="comment-item__menu-container">
                        <div
                            ref={menuButtonRef}
                            className="comment-item__menu"
                            onClick={handleMenuToggle}
                        >
                            <BsThreeDots size={18} />
                        </div>
                        {isMenuOpen && <Menu />}
                    </div>
                </div>

                {comment.status === 'deleted' ? (
                    <div className="comment-item__body comment-item__body--deleted">
                        [This comment has been deleted]
                    </div>
                ) : isEditing ? (
                    <div className="comment-item__edit">
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
                    <div className="comment-item__body">{comment.comment_text}</div>
                )}

                {comment.status !== 'deleted' && (
                    <ActionsContainer>
                        <CommentVoteButtons
                            commentId={comment.id}
                            initialVoteCount={voteCount}
                            currentUserId={currentUserId}
                            onVote={handleVote}
                        />
                        {canReply && (
                            <ReplyButton onClick={() => setShowReplyForm(!showReplyForm)} />
                        )}
                    </ActionsContainer>
                )}

                {comment.reply_count > 0 && (
                    <button
                        className="comment-item__show-replies"
                        onClick={() => setShowReplies(!showReplies)}
                        title={showReplies ? 'Hide replies' : 'Show replies'}
                    >
                        {showReplies ? <IoChevronUp size={16} /> : <IoChevronDown size={16} />}
                        <span>{comment.reply_count} {comment.reply_count === 1 ? 'reply' : 'replies'}</span>
                    </button>
                )}

                {showReplyForm && currentUserId && (
                    <div className="comment-item__reply-form">
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
                    <div className="comment-item__replies">
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
