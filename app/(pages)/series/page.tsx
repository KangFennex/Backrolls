import PageContainer from '../../ui/pageContainer';
import SeriesPageClient from '../../ui/series/SeriesPageClient';
import { getFilteredQuotes } from '../../api/data/data';
import { SeriesPageProps } from '../../lib/definitions';

export default async function SeriesRoute() {
    return (
        <PageContainer>
            <SeriesPageClient />
        </PageContainer>
    );
}