'use client'

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Quote } from '../../lib/definitions';
import { BackrollCardSlim } from '../backrollCards/BackrollCardSlim';
import { useBackrollsStore } from '../../store/backrollsStore';
import { useNavigationContext } from '../../context/NavigationContext';
import { useSeriesQuotes } from '../../lib/hooks';
import { adjustedRegion } from '../../lib/utils';
import PageComponentContainer from '../shared/pageComponentContainer';
import { SectionSkeleton } from '../shared/skeletons';
import { codeEquivalence } from '../../lib/newRepertoire';

export default function SeriesPageClient(): React.ReactElement {
    // Use selector to ensure component re-renders when filters change
    const filters = useBackrollsStore((state) => state.filters);
    const setFilters = useBackrollsStore((state) => state.setFilters);
    const { navigateToBackroll } = useNavigationContext();
    const searchParams = useSearchParams();
    const { selectedRegion, selectedSeries, selectedSeason, selectedEpisode } = filters;
    const seriesName = selectedSeries ? codeEquivalence[selectedSeries] ?? selectedSeries : '';

    // Sync filters from URL params on mount and when URL actually changes
    useEffect(() => {
        const region = searchParams.get('region') || 'americas';
        const series = searchParams.get('series');
        const season = searchParams.get('season');
        const episode = searchParams.get('episode');

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

    const quotes = data?.quotes || [];

    const handleClick = (quote: Quote) => {
        navigateToBackroll(quote);
    };

    const breadCrumbs = () => {
        return (
            selectedRegion || selectedSeries || selectedSeason || selectedEpisode) && (
                <div className="w-full text-[#FFFFF0] text-left text-sm mb-2 mt-2">
                    {selectedRegion && <span>{adjustedRegion(selectedRegion)} <span> • </span></span>}
                    {selectedSeries && <span>{seriesName} <span> • </span></span>}
                    {selectedSeason && <span>S{selectedSeason > 9 ? selectedSeason : `0${selectedSeason}`}</span>}
                    {selectedEpisode && <span>E{selectedEpisode > 9 ? selectedEpisode : `0${selectedEpisode}`}</span>}
                </div>
            )
    }

    const displayResultLength = () => {
        const resultsLength = quotes.length;
        return (
            <div>
                <h2 className="text-xl font-semibold mb-4 ghost-white">
                    Found {resultsLength} backrolls
                </h2>
            </div>
        );
    }

    // Loading state
    if (isLoading) {
        return (
            <div className="w-full">
                {breadCrumbs()}
                <PageComponentContainer variant="list">
                    <SectionSkeleton />
                </PageComponentContainer>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="w-full">
                {/* Breadcrumbs */}
                {breadCrumbs()}
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
                {breadCrumbs()}
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
            <div className="ml-4">
                {breadCrumbs()}
                {displayResultLength()}
            </div>
            <PageComponentContainer>
                {quotes.map((quote) => (
                    <div key={quote.id}>
                        <BackrollCardSlim
                            quote={quote}
                            onClick={() => handleClick(quote)}
                        />
                    </div>
                ))}
            </PageComponentContainer>
        </div>
    );
}
