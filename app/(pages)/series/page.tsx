import PageContainer from '../../ui/pageContainer';
import SeriesPageClient from '../../ui/series/SeriesPageClient';
import { getFilteredQuotes } from '../../api/data/data';
import { SeriesPageProps } from '../../lib/definitions';

export default async function SeriesRoute({ searchParams }: SeriesPageProps) {
    const params = await searchParams;
    const region = params.region;
    const series = params.series;
    const season = params.season ? parseInt(params.season) : undefined;
    const episode = params.episode ? parseInt(params.episode) : undefined;

    // Fetch initial data on server for hydration
    const quotes = region ? await getFilteredQuotes({
        region,
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
                    region,
                    series,
                    season,
                    episode
                }}
            />
        </PageContainer>
    );
}