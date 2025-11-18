import PageContainer from "../../../ui/pageContainer";
import BackrollDetailClient from "../../../ui/backrolls/BackrollDetailClient";

export default function BackrollDetailPage({ params }: { params: { id: string } }) {
    return (
        <PageContainer>
            <BackrollDetailClient quoteId={params.id} />
        </PageContainer>
    );
}
