import PageContainer from '../../ui/shared/pageContainer';
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