'use client';

import '@/app/scss/components/CommentItem.scss';
import '@/app/scss/components/ActionButtons.scss';
import { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { ReplyButton, ActionsContainer } from '../../shared/ActionButtons';
import { CommentVoteButtons } from '../../shared/ActionButtons';
import { useDeleteComment } from '../../../lib/hooks';
import CommentForm from './CommentForm';
import CommentList from './CommentList';
import CommentItemMenu from './CommentItemMenu';
import { formatDate } from '../../../lib/utils';
import { BsThreeDots } from "react-icons/bs";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";

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
    const [showReplies, setShowReplies] = useState(true);
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
    const menuButtonRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const { data: session } = useSession();

    const userId = (session as { user?: { id?: string } } | null | undefined)?.user?.id;
    const isOwner = userId === comment.user_id;
    const maxVisualDepth = 2;

    const deleteComment = useDeleteComment({
        quoteId: comment.quote_id,
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

    const handleReply = () => {
        setShowReplyForm(true);
        onReply(comment.id);
    };

    const handleDelete = async (e?: React.MouseEvent) => {
        if (e) {
            e.stopPropagation();
        }

        if (!confirm('Are you sure you want to delete this comment?')) {
            return;
        }

        setIsMenuOpen(false);

        try {
            await deleteComment.mutateAsync({ commentId: comment.id });
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

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

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsEditing(true);
        setIsMenuOpen(false);
    };

    const visualDepth = Math.min(depth, maxVisualDepth);

    return (
        <div className={`comment-item comment-item--depth-${visualDepth}`}>
            {/* Comment Header */}
            <div className="comment-item__header">
                <div className="comment-item__user-info">
                    {/* User Avatar */}
                    <div className="comment-item__avatar">
                        {user?.username?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div className="comment-item__user-details">
                        <span className="comment-item__username">{user?.username || 'Unknown User'}</span>
                        <div className="comment-item__meta">
                            <span>
                                {formatDate(comment.created_at)}
                            </span>
                            {comment.is_edited && <span className="comment-item__edited">· edited</span>}
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
                        <CommentItemMenu
                            menuRef={menuRef}
                            menuPosition={menuPosition}
                            isOwner={isOwner}
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
            {isEditing ? (
                <CommentForm
                    commentId={comment.id}
                    quoteId={comment.quote_id}
                    parentCommentId={comment.parent_comment_id}
                    initialValue={comment.comment_text}
                    onSuccess={() => setIsEditing(false)}
                    isEditing={true}
                    onCancel={() => setIsEditing(false)}
                />
            ) : (
                <div className="comment-item__content">
                    <p>
                        {comment.comment_text}
                    </p>
                </div>
            )}

            {/* Comment Footer */}
            <div className="comment-item__footer">
                <div className="comment-item__footer-actions">
                    <ActionsContainer>
                        <CommentVoteButtons
                            commentId={comment.id}
                            initialVoteCount={comment.vote_count}
                        />

                        <ReplyButton onClick={handleReply} />
                    </ActionsContainer>
                </div>

                {/* Show Replies Toggle */}
                {replyCount > 0 && (
                    <button
                        onClick={() => setShowReplies(!showReplies)}
                        className="comment-item__show-replies"
                        title={showReplies ? 'Hide replies' : 'Show replies'}
                    >
                        {showReplies ? <IoChevronUp size={16} /> : <IoChevronDown size={16} />}
                        <span>{replyCount} {replyCount === 1 ? 'reply' : 'replies'}</span>
                    </button>
                )}
            </div>

            {/* Reply Form */}
            {showReplyForm && (
                <div className="comment-item__reply-form">
                    <CommentForm
                        quoteId={comment.quote_id}
                        parentCommentId={comment.id}
                        onSuccess={() => setShowReplyForm(false)}
                        onCancel={() => setShowReplyForm(false)}
                    />
                </div>
            )}

            {/* Nested Replies */}
            {showReplies && replyCount > 0 && (
                <div className="comment-item__replies">
                    <CommentList
                        comments={[]} // Will be fetched by the CommentList component
                        onReply={onReply}
                        parentCommentId={comment.id}
                        depth={Math.min(depth + 1, maxVisualDepth)}
                    />
                </div>
            )}
        </div>
    );
}