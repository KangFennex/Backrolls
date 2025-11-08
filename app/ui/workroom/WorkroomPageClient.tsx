'use client'

import { Quote } from '../../lib/definitions';
import { useEffect } from 'react';
import { useWorkroomQuotes } from '../../lib/hooks';
import { BackrollCard } from '../backrollCards/BackrollCard';
import { useNavigationContext } from '../../context/NavigationContext';
import PageComponentContainer from '../pageComponentContainer';

export default function WorkroomPageClient() {
    const { navigateToBackroll } = useNavigationContext();
    const { data: randomData } = useWorkroomQuotes(30);
    const handleClick = (quote: Quote) => {
        navigateToBackroll(quote);
    }

    useEffect(() => {
        const handleVoteUpdate = (event: Event) => {
            const customEvent = event as CustomEvent;
            const { quoteId, newVoteCount } = customEvent.detail;

            // ⚠️ NOTE: With TanStack Query, we'd typically use mutations
            // for vote updates, but for now we'll keep the existing pattern
            // We'll cover mutations in future hooks!

            // This is a limitation of the current approach - we can't directly
            // update the cached data. In a full TanStack Query implementation,
            // we'd use queryClient.setQueryData() to update the cache
            console.log('Vote update received:', quoteId, newVoteCount);
        };

        window.addEventListener('voteUpdated', handleVoteUpdate);
        return () => window.removeEventListener('voteUpdated', handleVoteUpdate);
    }, []);

    if (!randomData?.quote || randomData.quote.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                No backrolls for you today
            </div>
        );
    }

    return (
        <PageComponentContainer>
            {randomData?.quote?.map((quote: Quote, index: number) => (
                <div key={quote.id} className="flex-shrink-0 min-w-[250px]">
                    <BackrollCard
                        quote={quote}
                        variant="full"
                        index={index}
                        onClick={() => handleClick(quote)}
                    />
                </div>
            ))}
        </PageComponentContainer>
    );
}
