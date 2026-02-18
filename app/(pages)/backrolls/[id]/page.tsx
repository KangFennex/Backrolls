import PageContainer from "../../../ui/shared/pageContainer";
import BackrollDetailClient from "../../../ui/backrolls/BackrollDetailClient";
import { BackrollDetailSkeleton } from "../../../ui/shared/skeletons";
import { Suspense } from 'react';

interface BackrollDetailPageProps {
    params: Promise<{ id: string }>;
}

export default async function BackrollDetailPage({ params }: BackrollDetailPageProps) {
    const { id } = await params;
    return (
        <PageContainer>
            <Suspense fallback={<BackrollDetailSkeleton />}>
                <BackrollDetailClient backrollId={id} />
            </Suspense>
        </PageContainer>
    );
}
