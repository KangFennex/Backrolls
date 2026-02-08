'use client';

import '@/app/scss/components/CommentItem.scss';
import '@/app/scss/components/ActionButtons.scss';
import { useState, useRef, useEffect } from 'react';
import { CommentForm } from './CommentForm';
import { formatDate } from '../../../lib/utils';
import { useDeletePostComment } from '../../../lib/hooks';
import PostDropdownMenu from './PostDropdownMenu';
import { PostCommentVoteButtons, ReplyButton, ActionsContainer } from '../../shared/ActionButtons';
import CommentList from './CommentList';

// Icons
import { BsThreeDots } from "react-icons/bs";
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
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
    const menuButtonRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    const deleteComment = useDeletePostComment({
        postId,
        parentCommentId: comment.parent_comment_id,
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

    // Close menu when scrolling
    useEffect(() => {
        const handleScroll = () => {
            if (isMenuOpen) {
                setIsMenuOpen(false);
            }
        };

        if (isMenuOpen) {
            window.addEventListener('scroll', handleScroll, true);
        }

        return () => {
            window.removeEventListener('scroll', handleScroll, true);
        };
    }, [isMenuOpen]);

    const handleMenuToggle = (e: React.MouseEvent) => {
        e.stopPropagation();

        if (!isMenuOpen && menuButtonRef.current) {
            const rect = menuButtonRef.current.getBoundingClientRect();
            setMenuPosition({
                top: window.scrollY + rect.bottom + 4,
                left: window.scrollX + rect.right - 140,
            });
        }

        setIsMenuOpen(!isMenuOpen);
    };

    const handleMenuAction = (action: string, e: React.MouseEvent) => {
        e.stopPropagation();
        console.log(`${action} comment:`, comment.id);
        setIsMenuOpen(false);
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

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsEditing(true);
        setIsMenuOpen(false);
    };

    return (
        <div className={`comment-item comment-item--depth-${Math.min(depth, 5)}`}>
            {/* Comment Header */}
            <div className="comment-item__header">
                <div className="comment-item__user-info">
                    {/* User Avatar */}
                    <div className="comment-item__avatar">
                        {comment.username?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div className="comment-item__user-details">
                        <span className="comment-item__username">
                            {comment.username || 'Deleted User'}
                        </span>
                        <div className="comment-item__meta">
                            <span>
                                {formatDate(comment.created_at)}
                            </span>
                            {comment.is_edited && (
                                <span className="comment-item__edited">· edited</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Three-dot Menu */}
                <div className="comment-item__menu-container">
                    <div
                        ref={menuButtonRef}
                        className="comment-item__menu"
                        onClick={handleMenuToggle}
                    >
                        <BsThreeDots size={18} />
                    </div>
                    {isMenuOpen && (
                        <PostDropdownMenu
                            menuRef={menuRef}
                            menuPosition={menuPosition}
                            isOwner={isAuthor}
                            isDeleting={deleteComment.isPending}
                            onSave={(e) => handleMenuAction('Save', e)}
                            onHide={(e) => handleMenuAction('Hide', e)}
                            onReport={(e) => handleMenuAction('Report', e)}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    )}
                </div>
            </div>

            {/* Comment Content */}
            {comment.status === 'deleted' ? (
                <div className="comment-item__body comment-item__body--deleted">
                    [This comment has been deleted]
                </div>
            ) : isEditing ? (
                <CommentForm
                    commentId={comment.id}
                    postId={postId}
                    parentCommentId={comment.parent_comment_id || undefined}
                    initialValue={comment.comment_text || ''}
                    onSuccess={() => setIsEditing(false)}
                    isEditing={true}
                    onCancel={() => setIsEditing(false)}
                />
            ) : (
                <div className="comment-item__content">
                    <p>{comment.comment_text}</p>
                </div>
            )}

            {/* Comment Footer */}
            <div className="comment-item__footer">
                {comment.status !== 'deleted' && (
                    <div className="comment-item__footer-actions">
                        <ActionsContainer>
                            <PostCommentVoteButtons
                                commentId={comment.id}
                                initialVoteCount={comment.vote_count}
                            />
                            {canReply && (
                                <ReplyButton onClick={() => setShowReplyForm(!showReplyForm)} />
                            )}
                        </ActionsContainer>
                    </div>
                )}

                {/* Show Replies Toggle */}
                {comment.reply_count > 0 && (
                    <button
                        onClick={() => setShowReplies(!showReplies)}
                        className="comment-item__show-replies"
                        title={showReplies ? 'Hide replies' : 'Show replies'}
                    >
                        {showReplies ? <IoChevronUp size={16} /> : <IoChevronDown size={16} />}
                        <span>{comment.reply_count} {comment.reply_count === 1 ? 'reply' : 'replies'}</span>
                    </button>
                )}
            </div>

            {/* Reply Form */}
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

            {/* Nested Replies */}
            {showReplies && comment.reply_count > 0 && (
                <div className="comment-item__replies">
                    <CommentList
                        postId={postId}
                        parentCommentId={comment.id}
                        depth={depth + 1}
                        currentUserId={currentUserId}
                    />
                </div>
            )}
        </div>
    );
}
