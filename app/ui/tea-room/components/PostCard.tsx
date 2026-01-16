'use client';

import '@/app/scss/pages/tea-room/PostCard.scss';
import Link from 'next/link';
import { VoteButtons } from './ActionButtons';

// Action icons
import { FaRegComment } from "react-icons/fa6";
import { IoShareSocialSharp } from "react-icons/io5";
import { BsThreeDots } from "react-icons/bs";


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

const Actions = ({ post }: { post: PostCardProps['post'] }) => {
    return (
        <div className="post-card__actions">
            <VoteButtons post_id={post.id} initialVoteCount={post.vote_count} />
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
    )
};

export function PostCard({ post }: PostCardProps) {

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
                <Actions post={post} />
            </div>
        </div>
    );
}
