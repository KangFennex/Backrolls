// This is a React Server Component - no 'use client' directive
import { getFilteredQuotes } from '../../../api/data/data';
import { SeriesClient } from './SeriesClient';

interface SeriesListServerProps {
    searchParams: Promise<{
        category?: string;
        series?: string;
        season?: string;
        episode?: string;
    }>
}

export default async function SeriesServer({ searchParams }: SeriesListServerProps) {
    const params = await searchParams;
    const category = params.category;
    const series = params.series;
    const season = params.season ? parseInt(params.season) : undefined;
    const episode = params.episode ? parseInt(params.episode) : undefined;

    // Direct database call - no API route needed
    const quotes = category ? await getFilteredQuotes({
        category,
        series,
        season,
        episode,
        limit: 50
    }) : [];

    // Pass server-fetched data to client component for interactivity
    return (
        <SeriesClient
            initialQuotes={quotes}
            initialFilters={{
                category,
                series,
                season,
                episode
            }}
        />
    );
}