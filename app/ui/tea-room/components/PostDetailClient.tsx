'use client';

import { trpc } from '@/app/lib/trpc';
import { useAuth } from '../../../lib/hooks';
import { CommentSection } from '@/app/ui/tea-room/components/CommentSection';
import { PostVoteButtons, CommentButton, ShareButton, ActionsContainer } from './ActionButtons';
import Link from 'next/link';
import '@/app/scss/pages/tea-room/PostDetailPage.scss';
import PageComponentContainer from '../../pageComponentContainer';

interface PostDetailClientProps {
    postId: string;
}

export function PostDetailClient({ postId }: PostDetailClientProps) {
    const { user } = useAuth();
    const { data: post, isLoading, error } = trpc.post.getPost.useQuery({ postId });

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
                <div className="post-detail__breadcrumb">
                    <Link href="/tea-room">Tea Room</Link>
                    <span className="separator">/</span>
                    <Link href={`/tea-room?community=${post.community_id}`}>{post.community_slug}</Link>
                </div>

                <div className="post-detail__container">
                    <div className="post-detail__content">
                        <div className="post-detail__header">
                            <div className="post-detail__meta">
                                <Link href={`/tea-room?community=${post.community_id}`} className="community-link">
                                    {post.community_slug}
                                </Link>
                                <span className="separator">•</span>
                                <span className="author">Posted by {post.username || '[unknown]'}</span>
                                <span className="separator">•</span>
                                <span className="date">{formatDate(post.created_at)}</span>
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
                                        <img src={post.url} alt={post.title} />
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
                            <CommentButton count={post.comment_count} asLink={false} />
                            <ShareButton />
                        </ActionsContainer>
                    </div>
                </div>

                <CommentSection postId={postId} currentUserId={user?.id} />
            </div>
        </PageComponentContainer>
    );
}
