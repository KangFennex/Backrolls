'use client'

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Quote } from '../../lib/definitions';
import { BackrollCard } from '../backrollCards/BackrollCard';
import { useBackrollsStore } from '../../store/backrollsStore';
import { useNavigationContext } from '../../context/NavigationContext';
import { useSeriesQuotes } from '../../lib/hooks';
import PageComponentContainer from '../pageComponentContainer';
import { getMosaicClass } from '../../lib/utils';

export default function SeriesPageClient(): React.ReactElement {
    // Use selector to ensure component re-renders when filters change
    const filters = useBackrollsStore((state) => state.filters);
    const setFilters = useBackrollsStore((state) => state.setFilters);
    const { navigateToBackroll } = useNavigationContext();
    const searchParams = useSearchParams();
    
    console.log('🔄 SeriesPageClient render, filters:', filters);

    // Sync filters from URL params on mount and when URL actually changes
    useEffect(() => {
        const region = searchParams.get('region') || 'americas';
        const series = searchParams.get('series');
        const season = searchParams.get('season');
        const episode = searchParams.get('episode');

        console.log('📍 URL params changed:', { region, series, season, episode });

        setFilters({
            selectedRegion: region,
            selectedSeries: series,
            selectedSeason: season ? parseInt(season) : null,
            selectedEpisode: episode ? parseInt(episode) : null,
        });
    }, [searchParams, setFilters]);

    // Use TanStack Query to fetch quotes based on current filters
    const {
        data,
        isLoading,
        error,
    } = useSeriesQuotes({
        region: filters.selectedRegion,
        series: filters.selectedSeries,
        season: filters.selectedSeason,
        episode: filters.selectedEpisode,
    });

    // Debug: Log when filters change
    useEffect(() => {
        console.log('🎯 Current filters passed to useSeriesQuotes:', {
            region: filters.selectedRegion,
            series: filters.selectedSeries,
            season: filters.selectedSeason,
            episode: filters.selectedEpisode,
        });
    }, [filters.selectedRegion, filters.selectedSeries, filters.selectedSeason, filters.selectedEpisode]);

    const quotes = data?.quotes || [];
    const useMosaic = quotes.length > 8;

    // Debug: Log when data changes
    useEffect(() => {
        const currentQuotes = data?.quotes || [];
        console.log('📦 Data updated, showing', currentQuotes.length, 'quotes');
        if (currentQuotes.length > 0) {
            console.log('First quote:', currentQuotes[0].quote_text?.substring(0, 50));
            console.log('Episode of first quote:', currentQuotes[0].episode);
        }
    }, [data]);

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
