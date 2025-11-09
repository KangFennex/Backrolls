'use client'

import { useEffect } from 'react';
import { Quote } from '../../lib/definitions';
import { BackrollCard } from '../backrollCards/BackrollCard';
import { useBackrollsStore } from '../../store/backrollsStore';
import { useNavigationContext } from '../../context/NavigationContext';
import { useSeriesQuotes } from '../../lib/hooks';
import PageComponentContainer from '../pageComponentContainer';
import { getMosaicClass } from '../../lib/utils';

interface SeriesPageClientProps {
    initialQuotes: Quote[];
    initialFilters: {
        category?: string;
        series?: string;
        season?: number;
        episode?: number;
    };
}

export default function SeriesPageClient({ initialQuotes, initialFilters }: SeriesPageClientProps) {
    const { filters, setFilters } = useBackrollsStore();
    const { navigateToBackroll } = useNavigationContext();

    // Sync initial filters with store on mount
    useEffect(() => {
        if (initialFilters.category) {
            setFilters({
                seriesCategory: initialFilters.category,
                selectedSeries: initialFilters.series || null,
                selectedSeason: initialFilters.season || null,
                selectedEpisode: initialFilters.episode || null
            });
        }
    }, [initialFilters, setFilters]);

    // Use TanStack Query to fetch quotes based on current filters
    const {
        data,
        isLoading,
        error,
        updateQuoteInCache
    } = useSeriesQuotes(
        {
            category: filters.seriesCategory,
            series: filters.selectedSeries,
            season: filters.selectedSeason,
            episode: filters.selectedEpisode,
        },
        initialQuotes // Hydrate from server-side data
    );

    const quotes = data?.quotes || [];
    const octoQuotes = quotes.length > 8;

    // Listen for vote updates and update TanStack Query cache
    useEffect(() => {
        const handleVoteUpdate = (event: Event) => {
            const customEvent = event as CustomEvent;
            const { quoteId, newVoteCount } = customEvent.detail;

            updateQuoteInCache(quoteId, { vote_count: newVoteCount });
        };

        window.addEventListener('voteUpdated', handleVoteUpdate);
        return () => window.removeEventListener('voteUpdated', handleVoteUpdate);
    }, [updateQuoteInCache]);

    const handleClick = (quote: Quote) => {
        navigateToBackroll(quote);
    };

    // Helper function to format category display
    const adjustedCategory = (category: string | null) => {
        if (category === 'main-series') return "RuPaul's Drag Race";
        if (category === 'all-stars') return "All-Stars";
        if (category === 'spin-off') return "Spin-Off";
        if (category === 'international') return "International";
        return category;
    };

    const { seriesCategory, selectedSeries, selectedSeason, selectedEpisode } = filters;

    // Loading state
    if (isLoading) {
        return (
            <div className="w-full">
                {/* Breadcrumbs */}
                {(seriesCategory || selectedSeries || selectedSeason || selectedEpisode) && (
                    <div className="w-full text-[#FFFFF0] text-left text-sm mb-2 mt-2">
                        {seriesCategory && <span>{adjustedCategory(seriesCategory)} <span> • </span></span>}
                        {selectedSeries && <span>{selectedSeries} <span> • </span></span>}
                        {selectedSeason && <span>S{selectedSeason > 9 ? selectedSeason : `0${selectedSeason}`}</span>}
                        {selectedEpisode && <span>E{selectedEpisode > 9 ? selectedEpisode : `0${selectedEpisode}`}</span>}
                    </div>
                )}
                <PageComponentContainer>
                    <div className="text-center py-8 text-gray-400">Loading quotes...</div>
                </PageComponentContainer>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="w-full">
                {/* Breadcrumbs */}
                {(seriesCategory || selectedSeries || selectedSeason || selectedEpisode) && (
                    <div className="w-full text-[#FFFFF0] text-left text-sm mb-2 mt-2">
                        {seriesCategory && <span>{adjustedCategory(seriesCategory)} <span> • </span></span>}
                        {selectedSeries && <span>{selectedSeries} <span> • </span></span>}
                        {selectedSeason && <span>S{selectedSeason > 9 ? selectedSeason : `0${selectedSeason}`}</span>}
                        {selectedEpisode && <span>E{selectedEpisode > 9 ? selectedEpisode : `0${selectedEpisode}`}</span>}
                    </div>
                )}
                <PageComponentContainer>
                    <div className="text-center py-8 text-red-400">
                        Error loading quotes: {error.message}
                    </div>
                </PageComponentContainer>
            </div>
        );
    }

    // Empty state
    if (quotes.length === 0) {
        return (
            <div className="w-full">
                {/* Breadcrumbs */}
                {(seriesCategory || selectedSeries || selectedSeason || selectedEpisode) && (
                    <div className="w-full text-[#FFFFF0] text-left text-sm mb-2 mt-2">
                        {seriesCategory && <span>{adjustedCategory(seriesCategory)} <span> • </span></span>}
                        {selectedSeries && <span>{selectedSeries} <span> • </span></span>}
                        {selectedSeason && <span>S{selectedSeason > 9 ? selectedSeason : `0${selectedSeason}`}</span>}
                        {selectedEpisode && <span>E{selectedEpisode > 9 ? selectedEpisode : `0${selectedEpisode}`}</span>}
                    </div>
                )}
                <PageComponentContainer>
                    <div className="text-center py-8 text-gray-500">
                        No quotes found for the selected filters.
                    </div>
                </PageComponentContainer>
            </div>
        );
    }

    // Success state with quotes
    return (
        <div className="w-full">
            {/* Breadcrumbs */}
            {(seriesCategory || selectedSeries || selectedSeason || selectedEpisode) && (
                <div className="w-full text-[#FFFFF0] text-left text-sm mb-2 mt-5">
                    {seriesCategory && <span>{adjustedCategory(seriesCategory)} <span> • </span></span>}
                    {selectedSeries && <span>{selectedSeries} <span> • </span></span>}
                    {selectedSeason && <span>S{selectedSeason > 9 ? selectedSeason : `0${selectedSeason}`}</span>}
                    {selectedEpisode && <span>E{selectedEpisode > 9 ? selectedEpisode : `0${selectedEpisode}`}</span>}
                </div>
            )}
            <PageComponentContainer quotesLength={quotes.length}>
                <h2 className="text-xl font-semibold mb-4 text-[#FFFFF0]">
                    Found {quotes.length} quotes
                </h2>
                {quotes.map((quote, index) => (
                    <div key={quote.id} className={`${octoQuotes ? getMosaicClass(quote.quote_text, index) : 'flex-shrink-0 min-w-[250px]'}`}>
                        <BackrollCard
                            quote={quote}
                            variant="full"
                            index={index}
                            onClick={() => handleClick(quote)}
                        />
                    </div>
                ))}
            </PageComponentContainer>
        </div>
    );
}
