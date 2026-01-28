'use client';

import '@/app/scss/components/CommentItem.scss';
import '@/app/scss/components/ActionButtons.scss';
import '@/app/scss/components/DropdownMenu.scss';
import { useState, useRef, useEffect } from 'react';
import { trpc } from '../../../lib/trpc';
import { useSession } from 'next-auth/react';
import { CommentVoteButtons, ReplyButton, ActionsContainer } from '../../tea-room/components/ActionButtons';
import CommentForm from './CommentForm';
import CommentList from './CommentList';
import { formatDistanceToNow } from 'date-fns';
import { createPortal } from 'react-dom';
import { BsThreeDots } from "react-icons/bs";
import { MdDataSaverOn, MdEdit, MdDelete } from "react-icons/md";
import { BiHide } from "react-icons/bi";
import { MdReportGmailerrorred } from "react-icons/md";
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
    const utils = trpc.useContext();
    const [voteCount, setVoteCount] = useState(comment.vote_count);

    const userId = (session as { user?: { id?: string } } | null | undefined)?.user?.id;
    const isOwner = userId === comment.user_id;
    const maxDepth = 4; // Prevent infinite nesting

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

    const handleVote = (voteType: 'up' | 'down') => {
        // This is a simplified vote handler for the backrolls comments
        // Optimistic UI update
        console.log('Vote:', voteType);
    };

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
                {isOwner && (
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
        <div className={`comment-item comment-item--depth-${Math.min(depth, 4)}`}>
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
                                {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
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
                    {isMenuOpen && <Menu />}
                </div>
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
                            initialVoteCount={voteCount}
                            currentUserId={userId}
                            onVote={handleVote}
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
            {showReplies && replyCount > 0 && depth < maxDepth && (
                <div className="comment-item__replies">
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