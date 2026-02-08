'use client';

import { trpc } from '@/app/lib/trpc';
import { useAuth } from '../../../lib/hooks';
import { CommentSection } from '@/app/ui/tea-room/components/CommentSection';
import { PostVoteButtons, PostCommentButton, PostShareButton, ActionsContainer } from '../../shared/ActionButtons';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PostDropdownMenu from './PostDropdownMenu';
import { BsThreeDots } from 'react-icons/bs';
import '@/app/scss/pages/tea-room/PostDetailPage.scss';
import '@/app/scss/components/CommentItem.scss';
import PageComponentContainer from '../../shared/pageComponentContainer';
import Image from 'next/image';

interface PostDetailClientProps {
    postId: string;
}

export function PostDetailClient({ postId }: PostDetailClientProps) {
    const { user } = useAuth();
    const router = useRouter();
    const utils = trpc.useUtils();
    const { data: post, isLoading, error } = trpc.post.getPost.useQuery({ postId });

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
    const menuButtonRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    const deletePostMutation = trpc.post.deletePost.useMutation({
        onSuccess: async () => {
            await utils.community.getCommunityPosts.invalidate();
            await utils.feed.getPopularFeed.invalidate();
            router.push('/tea-room');
        },
        onError: (error) => {
            alert(`Failed to delete post: ${error.message}`);
        }
    });

    const isOwner = user?.id === post?.user_id;

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

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();

        if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
            return;
        }

        setIsMenuOpen(false);

        try {
            await deletePostMutation.mutateAsync({ postId: post!.id });
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    const handleMenuAction = (action: string, e: React.MouseEvent) => {
        e.stopPropagation();
        console.log(`${action} post:`, postId);
        setIsMenuOpen(false);
    };

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        console.log('Edit post:', postId);
        setIsMenuOpen(false);
        // Add edit logic here if needed
    };

    const formatDate = (date: string | Date) => {
        const now = new Date();
        const diffInMinutes = Math.floor((now.getTime() - new Date(date).getTime()) / (1000 * 60));

        if (diffInMinutes < 1) return 'just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
        if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d ago`;
        return new Date(date).toLocaleDateString();
    };

    if (isLoading) {
        return (
            <div className="post-detail">
                <div className="loading-spinner">Loading post...</div>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="post-detail">
                <div className="error-message">
                    {error?.message || 'Post not found'}
                </div>
                <Link href="/tea-room" className="btn btn--primary">
                    Back to Tea Room
                </Link>
            </div>
        );
    }

    return (
        <PageComponentContainer>
            <div className="post-detail">
                <div className="post-detail__container">
                    <div className="post-detail__content">
                        <div className="post-detail__header">
                            <div className="post-detail__meta">
                                <div className="post-detail__meta-content">
                                    <Link href={`/tea-room?community=${post.community_id}`} className="community-link">
                                        {post.community_slug}
                                    </Link>
                                    <span className="separator">•</span>
                                    <span className="author">Posted by {post.username || '[unknown]'}</span>
                                    <span className="separator">•</span>
                                    <span className="date">{formatDate(post.created_at)}</span>
                                </div>
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
                                            isOwner={isOwner}
                                            isDeleting={deletePostMutation.isPending}
                                            onSave={(e) => handleMenuAction('Save', e)}
                                            onHide={(e) => handleMenuAction('Hide', e)}
                                            onReport={(e) => handleMenuAction('Report', e)}
                                            onEdit={handleEdit}
                                            onDelete={handleDelete}
                                        />
                                    )}
                                </div>
                            </div>

                            <h1 className="post-detail__title">{post.title}</h1>

                            <div className="post-detail__badges">
                                {post.is_nsfw && <span className="badge badge--nsfw">NSFW</span>}
                                {post.is_spoiler && <span className="badge badge--spoiler">Spoiler</span>}
                            </div>
                        </div>

                        <div className="post-detail__body">
                            {post.post_type === 'text' && post.body && (
                                <div className="post-body">{post.body}</div>
                            )}
                            {post.post_type === 'image' && post.url && (
                                <div className="post-image__container">
                                    <div className="post-image">
                                        <Image 
                                            src={post.url} 
                                            alt={post.title} 
                                            fill 
                                            style={{ objectFit: 'contain' }} 
                                        />
                                    </div>
                                    {post.body && (
                                        <div className="post-body">{post.body}</div>
                                    )}
                                </div>
                            )}
                            {post.post_type === 'link' && post.url && (
                                <div className="post-link">
                                    <a href={post.url} target="_blank" rel="noopener noreferrer">
                                        {new URL(post.url).hostname}
                                        <span className="external-icon">↗</span>
                                    </a>
                                </div>
                            )}
                        </div>

                        <ActionsContainer>
                            <PostVoteButtons post_id={post.id} initialVoteCount={post.vote_count} />
                            <PostCommentButton postId={post.id} />
                            <PostShareButton />
                        </ActionsContainer>
                    </div>
                </div>

                <CommentSection postId={post.id} currentUserId={user?.id} />
            </div>
        </PageComponentContainer>
    );
}
