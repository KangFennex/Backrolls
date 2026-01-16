'use client';

import { trpc } from '@/app/lib/trpc';
import { useAuth, useVotesPosts, useTogglePostVote } from '../../../lib/hooks';
import { CommentSection } from '@/app/ui/tea-room/components/CommentSection';
import Link from 'next/link';
import '@/app/scss/pages/tea-room/PostDetailPage.scss';

interface PostDetailClientProps {
    postId: string;
}

export function PostDetailClient({ postId }: PostDetailClientProps) {
    const { user, isLoading: authLoading, isAuthenticated } = useAuth();
    const { data: post, isLoading, error } = trpc.post.getPost.useQuery({ postId });
    const { data: votesData } = useVotesPosts();
    const toggleVoteMutation = useTogglePostVote();

    const userVote = votesData?.votes.find(v => v.post_id === postId);

    const handleVote = (voteType: 'up' | 'down') => {
        toggleVoteMutation.mutate({ post_id: postId, vote_type: voteType });
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
        <div className="post-detail">
            <div className="post-detail__breadcrumb">
                <Link href="/tea-room">Tea Room</Link>
                <span className="separator">/</span>
                <Link href={`/tea-room?community=${post.community_id}`}>{post.community_slug}</Link>
            </div>

            <div className="post-detail__container">
                <div className="post-detail__votes">
                    <button
                        className={`vote-btn vote-btn--up ${userVote?.vote_type === 'up' ? 'vote-btn--active' : ''}`}
                        onClick={() => handleVote('up')}
                        disabled={!user?.id || toggleVoteMutation.isPending}
                        aria-label="Upvote"
                    >
                        ▲
                    </button>
                    <span className="vote-count">{post.vote_count}</span>
                    <button
                        className={`vote-btn vote-btn--down ${userVote?.vote_type === 'down' ? 'vote-btn--active' : ''}`}
                        onClick={() => handleVote('down')}
                        disabled={!user?.id || toggleVoteMutation.isPending}
                        aria-label="Downvote"
                    >
                        ▼
                    </button>
                </div>

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
                            <div className="post-image">
                                <img src={post.url} alt={post.title} />
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

                    <div className="post-detail__stats">
                        <span className="stat">
                            <span className="stat-icon">💬</span>
                            {post.comment_count} {post.comment_count === 1 ? 'comment' : 'comments'}
                        </span>
                        <span className="stat">
                            <span className="stat-icon">👁️</span>
                            {post.view_count} {post.view_count === 1 ? 'view' : 'views'}
                        </span>
                    </div>
                </div>
            </div>

            <CommentSection postId={postId} currentUserId={user?.id} />
        </div>
    );
}
