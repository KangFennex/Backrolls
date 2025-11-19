import PageContainer from '../../ui/pageContainer';
import SeriesPageClient from '../../ui/series/SeriesPageClient';

export default async function SeriesRoute() {
    return (
        <PageContainer>
            <SeriesPageClient />
        </PageContainer>
    );
}