'use client'

import { useState, useEffect, useRef } from 'react';
import { Quote } from '../../lib/definitions';
import { useNavigationContext } from '../../context/NavigationContext';
import { trpc } from '../../lib/trpc';
import { PageSectionHeader } from '../shared/PageSectionHeader';
import { series, seriesSeasons, seriesEpisodes, codeEquivalence } from '../../lib/newRepertoire';
import BackrollCardVerticalSkeleton from '../backrollCards/BackrollCardVerticalSkeleton';
import GuessFilters from './components/GuessFilters';
import GuessCardsSection from './components/GuessCardsSection';
import GuessFullscreenModal from './components/GuessFullscreenModal';

interface GuessPageClientProps {
    initialData: {
        quotes: Quote[];
        nextCursor?: string;
        seed: number;
    };
}

export default function GuessPageClient({ initialData }: GuessPageClientProps) {
    const { navigateToBackroll } = useNavigationContext();
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const observerTarget = useRef<HTMLDivElement>(null);

    // Filter states
    const [selectedRegion, setSelectedRegion] = useState<string>('');
    const [selectedSeries, setSelectedSeries] = useState<string>('');
    const [selectedSeason, setSelectedSeason] = useState<number | null>(null);
    const [selectedEpisode, setSelectedEpisode] = useState<number | null>(null);

    // Display states
    const [allQuotes, setAllQuotes] = useState<Quote[]>(initialData.quotes);
    const [seed] = useState(initialData.seed);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);

    // Determine if using filters or random
    const useFilters = !!(selectedRegion || selectedSeries || selectedSeason || selectedEpisode);

    // Random query
    const {
        data: randomData,
        fetchNextPage: fetchNextRandom,
        hasNextPage: hasNextRandom,
        isFetchingNextPage: isFetchingRandom
    } = trpc.quotes.getRandom.useInfiniteQuery(
        { limit: 15, seed },
        {
            initialData: {
                pages: [initialData],
                pageParams: [undefined],
            },
            getNextPageParam: (lastPage) => lastPage.nextCursor,
            refetchOnWindowFocus: false,
            staleTime: 1000 * 60 * 5,
            enabled: !useFilters,
        }
    );

    // Filtered query
    const { data: filteredData, isLoading: isFilteredLoading } = trpc.quotes.getFiltered.useQuery(
        {
            region: selectedRegion || undefined,
            series: selectedSeries || undefined,
            season: selectedSeason || undefined,
            episode: selectedEpisode || undefined,
            limit: 50,
        },
        {
            enabled: useFilters,
            refetchOnWindowFocus: false,
        }
    );

    // Update quotes based on data source
    useEffect(() => {
        if (useFilters && filteredData) {
            setAllQuotes(filteredData.quotes);
        } else if (randomData) {
            const quotes = randomData.pages.flatMap(page => page.quotes);
            setAllQuotes(quotes);
        }
    }, [randomData, filteredData, useFilters]);

    // Get filtered series based on region
    const filteredSeries = selectedRegion
        ? series.filter(s => s.region === selectedRegion)
        : series;

    // Get full series name from code for lookup
    const seriesName = selectedSeries ? codeEquivalence[selectedSeries] : null;

    // Get seasons for selected series
    const availableSeasons = seriesName && seriesSeasons[seriesName]
        ? Array.from({ length: seriesSeasons[seriesName] }, (_, i) => i + 1)
        : [];

    // Get episodes for selected season
    const availableEpisodes = seriesName && selectedSeason && seriesEpisodes[seriesName]?.[selectedSeason]
        ? Array.from({ length: seriesEpisodes[seriesName][selectedSeason] }, (_, i) => i + 1)
        : [];

    // Handle filter changes
    const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedRegion(e.target.value);
        setSelectedSeries('');
        setSelectedSeason(null);
        setSelectedEpisode(null);
    };

    const handleSeriesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedSeries(e.target.value);
        setSelectedSeason(null);
        setSelectedEpisode(null);
    };

    const handleSeasonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedSeason(e.target.value ? Number(e.target.value) : null);
        setSelectedEpisode(null);
    };

    const handleEpisodeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedEpisode(e.target.value ? Number(e.target.value) : null);
    };

    const handleClearFilters = () => {
        setSelectedRegion('');
        setSelectedSeries('');
        setSelectedSeason(null);
        setSelectedEpisode(null);
    };

    // Intersection Observer for infinite scroll
    useEffect(() => {
        if (useFilters) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextRandom && !isFetchingRandom) {
                    fetchNextRandom();
                }
            },
            {
                threshold: 0.1,
                rootMargin: '0px 200px 0px 0px',
                root: scrollContainerRef.current
            }
        );

        const currentTarget = observerTarget.current;
        if (currentTarget) {
            observer.observe(currentTarget);
        }

        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget);
            }
        };
    }, [hasNextRandom, isFetchingRandom, fetchNextRandom, useFilters]);

    const handleClick = (quote: Quote) => {
        navigateToBackroll(quote);
    };

    const handleScrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({
                left: 400,
                behavior: 'smooth'
            });
        }
    };

    const handleExpandClick = () => {
        setIsFullscreen(true);
        setCurrentCardIndex(0);
        document.body.style.overflow = 'hidden';
    };

    const handleCloseFullscreen = () => {
        setIsFullscreen(false);
        document.body.style.overflow = 'auto';
    };

    const handleNextCard = () => {
        if (currentCardIndex < allQuotes.length - 1) {
            setCurrentCardIndex(prev => prev + 1);
        } else if (!useFilters && hasNextRandom && !isFetchingRandom) {
            fetchNextRandom();
            setCurrentCardIndex(prev => prev + 1);
        }
    };

    const handlePrevCard = () => {
        if (currentCardIndex > 0) {
            setCurrentCardIndex(prev => prev - 1);
        }
    };

    // Keyboard navigation
    useEffect(() => {
        if (!isFullscreen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                handleCloseFullscreen();
            } else if (e.key === 'ArrowRight') {
                handleNextCard();
            } else if (e.key === 'ArrowLeft') {
                handlePrevCard();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isFullscreen, currentCardIndex, allQuotes.length, hasNextRandom, isFetchingRandom, useFilters]);

    return (
        <main className="flex flex-col pb-12">
            <PageSectionHeader title="Guess the Queen" />

            <GuessFilters
                selectedRegion={selectedRegion}
                selectedSeries={selectedSeries}
                selectedSeason={selectedSeason}
                selectedEpisode={selectedEpisode}
                filteredSeries={filteredSeries}
                availableSeasons={availableSeasons}
                availableEpisodes={availableEpisodes}
                useFilters={useFilters}
                onRegionChange={handleRegionChange}
                onSeriesChange={handleSeriesChange}
                onSeasonChange={handleSeasonChange}
                onEpisodeChange={handleEpisodeChange}
                onClearFilters={handleClearFilters}
                onExpandClick={handleExpandClick}
            />

            {/* Loading State */}
            {isFilteredLoading && (
                <div className="flex gap-2 px-4 overflow-x-hidden">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} style={{ minWidth: '300px' }}>
                            <BackrollCardVerticalSkeleton />
                        </div>
                    ))}
                </div>
            )}

            {/* Cards Section */}
            {!isFilteredLoading && allQuotes.length > 0 && (
                <GuessCardsSection
                    allQuotes={allQuotes}
                    scrollContainerRef={scrollContainerRef}
                    observerTarget={observerTarget}
                    useFilters={useFilters}
                    isFetchingRandom={isFetchingRandom}
                    onQuoteClick={handleClick}
                    onScrollRight={handleScrollRight}
                />
            )}

            {/* No Results */}
            {!isFilteredLoading && allQuotes.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    No quotes found with the selected filters.
                </div>
            )}

            {/* Fullscreen Modal */}
            {isFullscreen && allQuotes.length > 0 && (
                <GuessFullscreenModal
                    allQuotes={allQuotes}
                    currentCardIndex={currentCardIndex}
                    useFilters={useFilters}
                    hasNextRandom={hasNextRandom}
                    onClose={handleCloseFullscreen}
                    onQuoteClick={handleClick}
                    onPrevCard={handlePrevCard}
                    onNextCard={handleNextCard}
                />
            )}
        </main>
    );
}