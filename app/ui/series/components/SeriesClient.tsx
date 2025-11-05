'use client'

import { useState, useEffect } from 'react';
import { Quote } from '../../../lib/definitions';
import { BackrollCard } from '../../backrolls/BackrollCard';
import { useBackrollsStore } from '../../../store/backrollsStore';
import { useNavigationContext } from '../../../context/NavigationContext';

interface SeriesListClientProps {
    initialQuotes: Quote[];
    initialFilters: {
        category?: string;
        series?: string;
        season?: number;
        episode?: number;
    }
}

export function SeriesClient({ initialQuotes, initialFilters }: SeriesListClientProps) {
    const { filters, setFilters } = useBackrollsStore();
    const { navigateToBackroll } = useNavigationContext();

    const [quotes, setQuotes] = useState<Quote[]>(initialQuotes);
    const [loading, setLoading] = useState(false);

    // Sync initial filters with store
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

    // Handle client-side filter changes (from filter drawer)
    useEffect(() => {
        const fetchFilteredQuotes = async () => {
            const { seriesCategory, selectedSeries, selectedSeason, selectedEpisode } = filters;

            // Only fetch if filters have changed from initial
            const filtersChanged =
                seriesCategory !== initialFilters.category ||
                selectedSeries !== initialFilters.series ||
                selectedSeason !== initialFilters.season ||
                selectedEpisode !== initialFilters.episode;

            if (!filtersChanged || !seriesCategory) return;

            setLoading(true);

            try {
                const searchParams = new URLSearchParams();
                searchParams.set('category', seriesCategory);

                if (selectedSeries) {
                    searchParams.set('series', selectedSeries);
                }

                if (selectedSeason !== null) {
                    searchParams.set('season', selectedSeason.toString());
                }

                if (selectedEpisode !== null) {
                    searchParams.set('episode', selectedEpisode.toString());
                }

                const response = await fetch(`/api/series?${searchParams.toString()}`);

                if (!response.ok) {
                    throw new Error('Failed to fetch quotes');
                }

                const { quotes: newQuotes } = await response.json();
                setQuotes(newQuotes);

            } catch (error) {
                console.error('Error fetching quotes:', error);
                setQuotes([]);
            } finally {
                setLoading(false);
            }
        };

        fetchFilteredQuotes();
    }, [filters, initialFilters]);

    // Listen for vote updates
    useEffect(() => {
        const handleVoteUpdate = (event: Event) => {
            const customEvent = event as CustomEvent;
            const { quoteId, newVoteCount } = customEvent.detail;

            setQuotes(currentQuotes =>
                currentQuotes.map(quote =>
                    quote.id === quoteId
                        ? { ...quote, vote_count: newVoteCount }
                        : quote
                )
            );
        };

        window.addEventListener('voteUpdated', handleVoteUpdate);
        return () => window.removeEventListener('voteUpdated', handleVoteUpdate);
    }, []);

    const handleQuoteClick = (quote: Quote) => {
        navigateToBackroll(quote);
    };

    if (loading) {
        return <div className="text-center py-8">Loading quotes...</div>;
    }

    if (quotes.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                No quotes found for the selected filters.
            </div>
        );
    }

    return (
        <>
            <h2 className="text-xl font-semibold mb-4">
                Found {quotes.length} quotes
            </h2>
            <div className="w-full flex flex-col justify-center space-y-4 mt-6">
                {quotes.map((quote, index) => (
                    <div key={quote.id} className="flex-shrink-0 min-w-[250px]">
                        <BackrollCard
                            quote={quote}
                            variant="full"
                            index={index}
                            onDoubleClick={() => handleQuoteClick(quote)}
                        />
                    </div>
                ))}
            </div>
        </>
    );
}