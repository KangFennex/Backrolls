'use client'

import { useEffect } from 'react';
import { BackrollCard } from '../../backrollCards/BackrollCard';
import { useNavigationContext } from '../../../context/NavigationContext';
import { useRandomQuotes, useRandomNavigation } from '../../../lib/hooks';
import PageComponentContainer from '../../pageComponentContainer';
import { Quote } from '../../../lib/definitions';

export default function RandomClientTanStack() {
    const { navigateToBackroll } = useNavigationContext();
    
    // 🎯 SIMPLIFIED: Get limit and navigationId from URL changes
    const { limit, navigationId } = useRandomNavigation();
    
    // 🚀 TanStack Query with clean navigation-based cache keys
    const {
        data: quotes,
        isLoading,
        isFetching,
        error,
        refetch,
        isStale,
        dataUpdatedAt
    } = useRandomQuotes({
        limit,
        navigationId // Creates fresh cache entry per navigation
    });

    const handleClick = (quote: Quote) => {
        navigateToBackroll(quote);
    };

    useEffect(() => {
        const handleVoteUpdate = (event: Event) => {
            const customEvent = event as CustomEvent;
            const { quoteId, newVoteCount } = customEvent.detail;

            // ⚠️ NOTE: With TanStack Query, we'd typically use mutations
            // for vote updates, but for now we'll keep the existing pattern
            // We'll cover mutations in future hooks!

            // This is a limitation of the current approach - we can't directly
            // update the cached data. In a full TanStack Query implementation,
            // we'd use queryClient.setQueryData() to update the cache
            console.log('Vote update received:', quoteId, newVoteCount);
        };

        window.addEventListener('voteUpdated', handleVoteUpdate);
        return () => window.removeEventListener('voteUpdated', handleVoteUpdate);
    }, []);

    if (error) {
        return (
            <div className="text-center py-8 text-red-500">
                <p>Failed to load random quotes</p>
                <button
                    onClick={() => refetch()}
                    className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                    Try Again
                </button>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="text-center py-8 text-gray-500">
                <p>Loading random quotes...</p>
                {/* In real app, you'd show skeleton components here */}
            </div>
        );
    }

    if (!quotes || quotes.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                <p>No quotes found.</p>
                <button
                    onClick={() => refetch()}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Refresh
                </button>
            </div>
        );
    }

    return (
        <PageComponentContainer>
            {isFetching && !isLoading && (
                <div className="text-center py-2 text-blue-500 text-sm">
                    <span>Refreshing...</span>
                </div>
            )}

            {/* 🗃️ Show data freshness info (useful for debugging) */}
            {process.env.NODE_ENV === 'development' && (
                <div className="text-center py-2 text-xs text-gray-400">
                    <span>Data {isStale ? 'is stale' : 'is fresh'} | </span>
                    <span>Last updated: {new Date(dataUpdatedAt).toLocaleTimeString()} | </span>
                    <button onClick={() => refetch()} className="underline">Force Refresh</button>
                </div>
            )}

            {quotes.map((quote: Quote, index: number) => (
                <div key={quote.id} className="flex-shrink-0 min-w-[250px]">
                    <BackrollCard
                        quote={quote}
                        variant="full"
                        index={index}
                        onClick={() => handleClick(quote)}
                    />
                </div>
            ))}
        </PageComponentContainer>
    );
}