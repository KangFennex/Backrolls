'use client';

import { useState } from 'react';
import Link from 'next/link';
import { trpc } from '@/app/lib/trpc';
import '@/app/scss/pages/tea-room/PostCard.scss';

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
    const [voteState, setVoteState] = useState<'up' | 'down' | null>(null);
    const [localVoteCount, setLocalVoteCount] = useState(post.vote_count);

    const voteMutation = trpc.post.votePost.useMutation({
        onSuccess: (data) => {
            if (data.action === 'removed') {
                setVoteState(null);
            } else {
                setVoteState(data.voteType as 'up' | 'down');
            }
        },
    });

    const handleVote = (type: 'up' | 'down') => {
        // Optimistic update
        if (voteState === type) {
            setVoteState(null);
            setLocalVoteCount(prev => prev + (type === 'up' ? -1 : 1));
        } else if (voteState) {
            setVoteState(type);
            setLocalVoteCount(prev => prev + (type === 'up' ? 2 : -2));
        } else {
            setVoteState(type);
            setLocalVoteCount(prev => prev + (type === 'up' ? 1 : -1));
        }

        voteMutation.mutate({ postId: post.id, voteType: type });
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));

        if (hours < 1) return 'just now';
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        if (days < 30) return `${days}d ago`;
        const months = Math.floor(days / 30);
        return `${months}mo ago`;
    };

    return (
        <div className="post-card">
            {/* Vote buttons */}
            <div className="post-card__votes">
                <button
                    className={`post-card__vote ${voteState === 'up' ? 'post-card__vote--active' : ''}`}
                    onClick={() => handleVote('up')}
                >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 5l5 7H5z" />
                    </svg>
                </button>
                <span className="post-card__vote-count">{localVoteCount}</span>
                <button
                    className={`post-card__vote ${voteState === 'down' ? 'post-card__vote--active' : ''}`}
                    onClick={() => handleVote('down')}
                >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 15l-5-7h10z" />
                    </svg>
                </button>
            </div>

            {/* Thumbnail for image/video posts */}
            {(post.post_type === 'image' || post.post_type === 'video') && post.thumbnail_url && (
                <div className="post-card__thumbnail">
                    <img src={post.thumbnail_url} alt="" />
                </div>
            )}

            {/* Content */}
            <div className="post-card__content">
                <div className="post-card__meta">
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

                <Link href={`/tea-room/${post.id}`} className="post-card__title-link">
                    <h3 className="post-card__title">
                        {post.is_nsfw && <span className="post-card__nsfw">NSFW</span>}
                        {post.is_spoiler && <span className="post-card__spoiler">Spoiler</span>}
                        {post.title}
                    </h3>
                </Link>

                {post.body && (
                    <p className="post-card__body">
                        {post.body.length > 300
                            ? `${post.body.substring(0, 300)}...`
                            : post.body
                        }
                    </p>
                )}

                {post.post_type === 'link' && post.url && (
                    <a
                        href={post.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="post-card__link"
                    >
                        {new URL(post.url).hostname} ↗
                    </a>
                )}

                <div className="post-card__actions">
                    <Link href={`/tea-room/${post.id}`} className="post-card__action">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M2 2h12v9H5l-3 3V2z" stroke="currentColor" strokeWidth="1.5" fill="none" />
                        </svg>
                        {post.comment_count} Comments
                    </Link>
                    <button className="post-card__action">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M11 2h3v3M13 2L8 7M7 3H3v10h10V9" />
                        </svg>
                        Share
                    </button>
                    <button className="post-card__action">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                            <circle cx="8" cy="8" r="1.5" />
                            <circle cx="8" cy="3" r="1.5" />
                            <circle cx="8" cy="13" r="1.5" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
