import PageContainer from '../../ui/pageContainer';
import SeriesPageServer from '../../ui/series/SeriesPageServer';
import { SeriesPageProps } from '../../lib/definitions';


export default function SeriesRoute({ searchParams }: SeriesPageProps) {
    return (
        <>
            <PageContainer>
                <SeriesPageServer searchParams={searchParams} />
            </PageContainer>
        </>
    );
}