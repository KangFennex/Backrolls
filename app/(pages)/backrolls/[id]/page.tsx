import PageContainer from "../../../ui/pageContainer";
import BackrollDetailClient from "../../../ui/backrolls/BackrollDetailClient";
import { Suspense } from 'react';

interface BackrollDetailClientProps {
    param: Promise<{ id: string }>;
}

export default async function BackrollDetailPage({ params }: BackrollDetailClientProps) {
    const { id } = await params;
    return (
        <PageContainer>
            <Suspense fallback={<div>Loading backroll...</div>}>
                <BackrollDetailClient backrollId={id} />
            </Suspense>
        </PageContainer>
    );
}
