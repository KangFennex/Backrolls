'use client';

import { useState } from 'react';
import Link from 'next/link';
import { trpc } from '@/app/lib/trpc';
import { FaRegComment } from "react-icons/fa6";
import { IoShareSocialSharp } from "react-icons/io5";
import { BsThreeDots } from "react-icons/bs";
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
                    <div className="post-card__menu">
                        <BsThreeDots size={18} />
                    </div>
                </div>

                {/* Content */}
                <div className="post-card__content">
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
                </div>

                {/* Thumbnail for image/video posts */}
                {(post.post_type === 'image' || post.post_type === 'video') && post.thumbnail_url && (
                    <div className={`post-card__thumbnail ${post.is_nsfw ? 'post-card__thumbnail--nsfw' : ''} ${post.is_spoiler ? 'post-card__thumbnail--spoiler' : ''}`}>
                        <img src={post.thumbnail_url} alt="" />
                    </div>
                )}

                {/* Actions with vote buttons */}
                <div className="post-card__actions">
                    <div className="post-card__action-btn">
                        <div className="post-card__action-content post-card__action-content--votes">
                            <button
                                className={`post-card__vote-btn ${voteState === 'up' ? 'post-card__vote-btn--active' : ''}`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleVote('up');
                                }}
                                disabled={voteMutation.isPending}
                            >
                                <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M10 5l5 7H5z" />
                                </svg>
                            </button>
                            <span className="post-card__vote-count">{localVoteCount}</span>
                            <button
                                className={`post-card__vote-btn ${voteState === 'down' ? 'post-card__vote-btn--active' : ''}`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleVote('down');
                                }}
                                disabled={voteMutation.isPending}
                            >
                                <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M10 15l-5-7h10z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    <Link href={`/tea-room/${post.id}`} className="post-card__action-btn">
                        <div className="post-card__action-content">
                            <FaRegComment size={18} />
                            <span className="post-card__action-count">
                                {post.comment_count > 99 ? '99+' : post.comment_count}
                            </span>
                        </div>
                    </Link>
                    <button className="post-card__action-btn">
                        <div className="post-card__action-content">
                            <IoShareSocialSharp size={18} />
                            <span className="post-card__action-text">
                                Share
                            </span>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}
