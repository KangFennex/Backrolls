'use client'

import { useSeriesContext } from '../../../context/SeriesContext';
import { useState, useEffect } from 'react';
import { Quote } from '../../../lib/definitions';
import { QuoteCard } from '../../backrolls/backrollsCards';
import SeriesBreadcrumbs from './SeriesBreadcrumbs';

export default function SeriesList() {
    const {
        seriesCategory,
        selectedSeries,
        selectedSeason,
        selectedEpisode
    } = useSeriesContext();

    const [filteredQuotes, setFilteredQuotes] = useState<Quote[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuotes = async () => {
            if (!seriesCategory) return;

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

                const { quotes } = await response.json();
                setFilteredQuotes(quotes);

            } catch (error) {
                console.error('Error fetching quotes:', error);
                setFilteredQuotes([]);
            } finally {
                setLoading(false);
            }
        };

        fetchQuotes();
    }, [seriesCategory, selectedSeries, selectedSeason, selectedEpisode]);

    if (loading) {
        return <div className="text-center py-8">Loading quotes...</div>;
    }

    if (filteredQuotes.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                No quotes found for the selected filters.
            </div>
        );
    }

    return (
        <>
            <h2 className="text-xl font-semibold mb-4">
                Found {filteredQuotes.length} quotes
            </h2>
            <div className="w-full flex flex-row justify-center flex-wrap space-y-4 mt-6">
                {filteredQuotes.map((quote, index) => (
                    <div key={quote.id} className="flex-shrink-0 min-w-[250px]">
                        <QuoteCard
                            quote={quote}
                            variant="compact"
                            index={index}
                        />
                    </div>
                ))}
            </div>
        </>
    );
}