'use client';

import { useEffect } from 'react';
import { BackrollCard } from '..//backrollCards/BackrollCard';
import { useNavigationContext } from '../../context/NavigationContext';
import { useFreshQuotes } from '../../lib/hooks';
import PageComponentContainer from '../pageComponentContainer';
import { Quote } from '../../lib/definitions';

export default function FreshPageClient() {
    const { navigateToBackroll } = useNavigationContext();
    const { data: freshData } = useFreshQuotes();

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

    return (
        <PageComponentContainer>
            {freshData?.quotes && freshData.quotes.map((quote: Quote, index: number) => (
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
