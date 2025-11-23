// Update your existing BackrollDetailClient.tsx
'use client'

import { BackrollCard } from '../backrollCards/BackrollCard';
import { useNavigationContext } from '../../context/NavigationContext';
import PageComponentContainer from '../pageComponentContainer';
import { trpc } from '../../lib/trpc';
import BackrollCommentsContainer from './components/BackrollCommentsContainer';

interface BackrollDetailClientProps {
    backrollId: string;
}

export default function BackrollDetailClient({ backrollId }: BackrollDetailClientProps) {
    const { navigateToBackroll } = useNavigationContext();
    const { data: quote, isLoading, error } = trpc.quotes.getById.useQuery({ id: backrollId });

    if (isLoading) {
        return (
            <PageComponentContainer>
                <div className="text-center py-8 text-gray-500">
                    Loading...
                </div>
            </PageComponentContainer>
        );
    }

    if (error || !quote) {
        return (
            <PageComponentContainer>
                <div className="text-center py-8 text-red-500">
                    Quote not found
                </div>
            </PageComponentContainer>
        );
    }

    return (
        <PageComponentContainer>
            <div className="flex-shrink-0 min-w-[250px]">
                <BackrollCard
                    quote={quote}
                    variant="full"
                    index={0}
                    onClick={() => navigateToBackroll(quote)}
                />
            </div>
            {/* Pass the quoteId to the comments container */}
            <BackrollCommentsContainer quoteId={backrollId} />
        </PageComponentContainer>
    );
}