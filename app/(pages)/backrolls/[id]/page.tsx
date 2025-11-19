import PageContainer from "../../../ui/pageContainer";
import BackrollDetailClient from "../../../ui/backrolls/BackrollDetailClient";
import { Suspense } from 'react';

interface BackrollDetailPageProps {
    params: Promise<{ id: string }>;
}

export default async function BackrollDetailPage({ params }: BackrollDetailPageProps) {
    const { id } = await params;
    return (
        <PageContainer>
            <Suspense fallback={<div>Loading backroll...</div>}>
                <BackrollDetailClient backrollId={id} />
            </Suspense>
        </PageContainer>
    );
}
