'use client';

import '@/app/scss/pages/tea-room/PostCard.scss';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { PostVoteButtons, PostCommentButton, PostShareButton, ActionsContainer } from '../../shared/ActionButtons';
import { createPortal } from 'react-dom';
import { formatDate } from '@/app/lib/utils';
import { useAuth } from '../../../lib/hooks/useAuth';
import { trpc } from '@/app/lib/trpc';
import { useRouter } from 'next/navigation';

// Action icons
import { BsThreeDots } from "react-icons/bs";
import { MdDataSaverOn } from "react-icons/md";
import { BiHide } from "react-icons/bi";
import { MdReportGmailerrorred } from "react-icons/md";
import { MdDelete } from "react-icons/md";


interface PostCardProps {
    post: {
        id: string;
        community_slug: string;
        title: string;
        body: string | null;
        post_type: string;
        url: string | null;
        thumbnail_url: string | null;
        created_at: string;
        vote_count: number;
        comment_count: number;
        community_id: string;
        user_id: string | null;
        is_nsfw: boolean;
        is_spoiler: boolean;
        flair_text: string | null;
    };
}

export function PostCard({ post }: PostCardProps) {
    const { user } = useAuth();
    const router = useRouter();
    const utils = trpc.useUtils();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
    const menuButtonRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    const deletePostMutation = trpc.post.deletePost.useMutation({
        onSuccess: async () => {
            // Invalidate all post-related queries to refetch data
            await utils.community.getCommunityPosts.invalidate();
            await utils.feed.getPopularFeed.invalidate();
            router.refresh();
        },
        onError: (error) => {
            alert(`Failed to delete post: ${error.message}`);
        }
    });

    const isOwner = user?.id === post.user_id;

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

    const handleMenuToggle = (e: React.MouseEvent) => {
        e.stopPropagation();

        if (!isMenuOpen && menuButtonRef.current) {
            const rect = menuButtonRef.current.getBoundingClientRect();

            setMenuPosition({
                top: rect.bottom + 4,
                left: rect.right - 140, // 140px is the min-width of dropdown
            });
        }

        setIsMenuOpen(!isMenuOpen);
    };

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();

        if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
            return;
        }

        setIsMenuOpen(false);

        try {
            await deletePostMutation.mutateAsync({ postId: post.id });
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    const handleMenuAction = (action: string, e: React.MouseEvent) => {
        e.stopPropagation();
        console.log(`${action} post:`, post.id);
        setIsMenuOpen(false);
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
                    <button
                        onClick={(e) => handleMenuAction('Save', e)}
                    >
                        Save
                    </button>
                </span>
                <span className="post-card__dropdown-item">
                    <BiHide size={18} />
                    <button
                        onClick={(e) => handleMenuAction('Hide', e)}
                    >
                        Hide
                    </button>
                </span>
                <span className="post-card__dropdown-item">
                    <MdReportGmailerrorred size={18} />
                    <button
                        onClick={(e) => handleMenuAction('Report', e)}
                    >
                        Report
                    </button>
                </span>
                {isOwner && (
                    <span className="post-card__dropdown-item post-card__dropdown-item--danger">
                        <MdDelete size={18} />
                        <button
                            onClick={handleDelete}
                            disabled={deletePostMutation.isPending}
                        >
                            {deletePostMutation.isPending ? 'Deleting...' : 'Delete'}
                        </button>
                    </span>
                )}
            </div>,
            document.body
        );
    };



    const handleExternalLinkClick = (e: React.MouseEvent, url: string) => {
        e.preventDefault();
        e.stopPropagation();
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    return (
        <div className="post-card">
            <div className="post-card__wrapper">

                {/* Meta */}
                <div className="post-card__meta">
                    <div>
                        <span className="post-card__community">
                            c/{post.community_slug}
                        </span>
                        <span className="post-card__separator">•</span>
                        <span className="post-card__time">{formatDate(post.created_at)}</span>
                        {post.flair_text && (
                            <>
                                <span className="post-card__separator">•</span>
                                <span className="post-card__flair">{post.flair_text}</span>
                            </>
                        )}
                    </div>
                    <div className="post-card__menu-container">
                        <div
                            ref={menuButtonRef}
                            className="post-card__menu"
                            onClick={handleMenuToggle}
                        >
                            <BsThreeDots size={18} />
                        </div>
                        {isMenuOpen && <Menu />}
                    </div>

                </div>

                {/* Content */}
                <Link href={`/tea-room/${post.id}`} className="post-card__content-link">
                    <div className="post-card__content">
                        <h3 className="post-card__title">
                            {post.is_nsfw && <span className="post-card__nsfw">NSFW</span>}
                            {post.is_spoiler && <span className="post-card__spoiler">Spoiler</span>}
                            {post.title}
                        </h3>

                        {post.body && (
                            <p className="post-card__body">
                                {post.body.length > 300
                                    ? `${post.body.substring(0, 300)}...`
                                    : post.body
                                }
                            </p>
                        )}

                        {post.post_type === 'link' && post.url && (
                            <span
                                className="post-card__link"
                                onClick={(e) => handleExternalLinkClick(e, post.url!)}
                            >
                                {new URL(post.url).hostname} ↗
                            </span>
                        )}
                    </div>

                    {/* Thumbnail for image/video posts */}
                    {(post.post_type === 'image' || post.post_type === 'video') && post.thumbnail_url && (
                        <div className={`post-card__thumbnail ${post.is_nsfw ? 'post-card__thumbnail--nsfw' : ''} ${post.is_spoiler ? 'post-card__thumbnail--spoiler' : ''}`}>
                            <img src={post.thumbnail_url} alt="" />
                        </div>
                    )}
                </Link>

                {/* Actions with vote buttons */}
                <ActionsContainer>
                    <PostVoteButtons post_id={post.id} initialVoteCount={post.vote_count} />
                    <PostCommentButton postId={post.id} />
                    <PostShareButton />
                </ActionsContainer>
            </div>
        </div>
    );
}