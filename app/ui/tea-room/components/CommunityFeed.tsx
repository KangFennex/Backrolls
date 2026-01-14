'use client';

import { trpc } from '@/app/lib/trpc';
import { PostCard } from './PostCard';
import { PostCardSkeleton } from './PostCardSkeleton';
import { useState, useEffect } from 'react';
import '@/app/scss/pages/tea-room/CommunityFeed.scss';

interface CommunityFeedProps {
    communityId: string | null;
    sortBy: 'hot' | 'new' | 'top';
}

export function CommunityFeed({ communityId, sortBy }: CommunityFeedProps) {
    const [offset, setOffset] = useState(0);
    const limit = 20;

    // Get feed based on whether a community is selected
    const feedQuery = communityId
        ? trpc.community.getCommunityPosts.useQuery({
            communityId,
            sortBy,
            limit,
            cursor: undefined,
        })
        : trpc.feed.getPopularFeed.useQuery({
            sortBy,
            limit,
            offset,
        });

    const { data, isLoading, error } = feedQuery;

    // Reset offset when filters change
    useEffect(() => {
        setOffset(0);
    }, [communityId, sortBy]);

    const handleLoadMore = () => {
        if (data?.nextOffset !== undefined) {
            setOffset(data.nextOffset);
        }
    };

    if (error) {
        return (
            <div className="tea-room__error">
                <p>Failed to load posts. Please try again.</p>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="tea-room__feed">
                {Array.from({ length: 5 }).map((_, i) => (
                    <PostCardSkeleton key={i} />
                ))}
            </div>
        );
    }

    if (!data?.items || data.items.length === 0) {
        return (
            <div className="tea-room__empty">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="10" strokeWidth="2" />
                    <path d="M8 15s1.5 2 4 2 4-2 4-2" strokeWidth="2" strokeLinecap="round" />
                    <line x1="9" y1="9" x2="9.01" y2="9" strokeWidth="2" strokeLinecap="round" />
                    <line x1="15" y1="9" x2="15.01" y2="9" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <p>No posts yet. Be the first to create one!</p>
            </div>
        );
    }

    return (
        <div className="tea-room__feed">
            {data.items.map((post) => (
                <PostCard key={post.id} post={post} />
            ))}

            {data.hasMore && (
                <button
                    className="tea-room__load-more"
                    onClick={handleLoadMore}
                    disabled={isLoading}
                >
                    {isLoading ? 'Loading...' : 'Load More'}
                </button>
            )}
        </div>
    );
}
