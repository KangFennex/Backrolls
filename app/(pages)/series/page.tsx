import PageContainer from '../../ui/pageContainer';
import SeriesPageClient from '../../ui/series/SeriesPageClient';
import { getFilteredQuotes } from '../../api/data/data';
import { SeriesPageProps } from '../../lib/definitions';

export default async function SeriesRoute({ searchParams }: SeriesPageProps) {
    const params = await searchParams;
    const category = params.category;
    const series = params.series;
    const season = params.season ? parseInt(params.season) : undefined;
    const episode = params.episode ? parseInt(params.episode) : undefined;

    // Fetch initial data on server for hydration
    const quotes = category ? await getFilteredQuotes({
        category,
        series,
        season,
        episode,
        limit: 50
    }) : [];

    return (
        <PageContainer>
            <SeriesPageClient
                initialQuotes={quotes}
                initialFilters={{
                    category,
                    series,
                    season,
                    episode
                }}
            />
        </PageContainer>
    );
}