import PageContainer from '../../ui/pageContainer';
import SeriesPageServer from '../../ui/series/SeriesPageServer';

interface SeriesPageProps {
    searchParams: Promise<{
        category?: string;
        series?: string;
        season?: string;
        episode?: string;
    }>
}

export default function SeriesRoute({ searchParams }: SeriesPageProps) {
    return (
        <>
            <PageContainer>
                <SeriesPageServer searchParams={searchParams} />
            </PageContainer>
        </>
    );
}