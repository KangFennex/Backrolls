import PageContainer from '../../ui/pageContainer';
import RandomPageServer from '../../ui/random/RandomPageServer';
import { RandomPageProps } from '../../lib/definitions';

export default function RandomPage({ searchParams }: RandomPageProps) {
    return (
        <>
            <PageContainer>
                <RandomPageServer searchParams={searchParams} />
            </PageContainer>
        </>
    )
}