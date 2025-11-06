import { getFilteredQuotes } from '../../../api/data/data';
import { SeriesClient } from './SeriesClient';
import { SeriesListServerProps } from '../../../lib/definitions';

export default async function SeriesServer({ searchParams }: SeriesListServerProps) {
    const params = await searchParams;
    const category = params.category;
    const series = params.series;
    const season = params.season ? parseInt(params.season) : undefined;
    const episode = params.episode ? parseInt(params.episode) : undefined;

    const quotes = category ? await getFilteredQuotes({
        category,
        series,
        season,
        episode,
        limit: 50
    }) : [];

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