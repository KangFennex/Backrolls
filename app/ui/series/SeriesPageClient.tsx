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
        region?: string;
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
        if (initialFilters.region) {
            setFilters({
                selectedRegion: initialFilters.region,
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
            region: filters.selectedRegion,
            series: filters.selectedSeries,
            season: filters.selectedSeason,
            episode: filters.selectedEpisode,
        },
        initialQuotes // Hydrate from server-side data
    );

    const quotes = data?.quotes || [];
    const useMosaic = quotes.length > 8;

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

    // Helper function to format region display
    const adjustedRegion = (region: string | null) => {
        if (region === 'americas') return "Americas";
        if (region === 'asia') return "Asia";
        if (region === 'europe') return "Europe";
        if (region === 'oceania') return "Oceania";
        if (region === 'africa') return "Africa";
        if (region === 'global') return "Global";
        return region;
    };

    const { selectedRegion, selectedSeries, selectedSeason, selectedEpisode } = filters;

    // Loading state
    if (isLoading) {
        return (
            <div className="w-full">
                {/* Breadcrumbs */}
                {(selectedRegion || selectedSeries || selectedSeason || selectedEpisode) && (
                    <div className="w-full text-[#FFFFF0] text-left text-sm mb-2 mt-2">
                        {selectedRegion && <span>{adjustedRegion(selectedRegion)} <span> • </span></span>}
                        {selectedSeries && <span>{selectedSeries} <span> • </span></span>}
                        {selectedSeason && <span>S{selectedSeason > 9 ? selectedSeason : `0${selectedSeason}`}</span>}
                        {selectedEpisode && <span>E{selectedEpisode > 9 ? selectedEpisode : `0${selectedEpisode}`}</span>}
                    </div>
                )}
                <PageComponentContainer variant="list">
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
                {(selectedRegion || selectedSeries || selectedSeason || selectedEpisode) && (
                    <div className="w-full text-[#FFFFF0] text-left text-sm mb-2 mt-2">
                        {selectedRegion && <span>{adjustedRegion(selectedRegion)} <span> • </span></span>}
                        {selectedSeries && <span>{selectedSeries} <span> • </span></span>}
                        {selectedSeason && <span>S{selectedSeason > 9 ? selectedSeason : `0${selectedSeason}`}</span>}
                        {selectedEpisode && <span>E{selectedEpisode > 9 ? selectedEpisode : `0${selectedEpisode}`}</span>}
                    </div>
                )}
                <PageComponentContainer variant="list">
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
                {(selectedRegion || selectedSeries || selectedSeason || selectedEpisode) && (
                    <div className="w-full text-[#FFFFF0] text-left text-sm mb-2 mt-2">
                        {selectedRegion && <span>{adjustedRegion(selectedRegion)} <span> • </span></span>}
                        {selectedSeries && <span>{selectedSeries} <span> • </span></span>}
                        {selectedSeason && <span>S{selectedSeason > 9 ? selectedSeason : `0${selectedSeason}`}</span>}
                        {selectedEpisode && <span>E{selectedEpisode > 9 ? selectedEpisode : `0${selectedEpisode}`}</span>}
                    </div>
                )}
                <PageComponentContainer variant="list">
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
            {(selectedRegion || selectedSeries || selectedSeason || selectedEpisode) && (
                <div className="w-full text-[#FFFFF0] text-left text-sm mb-2 mt-5">
                    {selectedRegion && <span>{adjustedRegion(selectedRegion)} <span> • </span></span>}
                    {selectedSeries && <span>{selectedSeries} <span> • </span></span>}
                    {selectedSeason && <span>S{selectedSeason > 9 ? selectedSeason : `0${selectedSeason}`}</span>}
                    {selectedEpisode && <span>E{selectedEpisode > 9 ? selectedEpisode : `0${selectedEpisode}`}</span>}
                </div>
            )}
            <PageComponentContainer variant={useMosaic ? 'mosaic' : 'list'}>
                <h2 className="text-xl font-semibold mb-4 text-[#FFFFF0]">
                    Found {quotes.length} quotes
                </h2>
                {quotes.map((quote, index) => (
                    <div key={quote.id} className={useMosaic ? getMosaicClass(quote.quote_text, index) : ''}>
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
