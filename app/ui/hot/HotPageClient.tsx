'use client';

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { BackrollCard } from '..//backrollCards/BackrollCard';
import { useNavigationContext } from '../../context/NavigationContext';
import { useHotQuotes } from '../../lib/hooks';
import PageComponentContainer from '../pageComponentContainer';
import { Quote } from '../../lib/definitions';

export default function HotPageClient() {
    const { navigateToBackroll } = useNavigationContext();
    const { data: hotData } = useHotQuotes(10);
    const queryClient = useQueryClient();

    const handleClick = (quote: Quote) => {
        navigateToBackroll(quote);
    }

    useEffect(() => {
        const handleVoteUpdate = (event: Event) => {
            const customEvent = event as CustomEvent;
            const { quoteId, newVoteCount } = customEvent.detail;

            // Updates the TanStack Query cache directly
            queryClient.setQueryData<{ quotes: Quote[]; count: number }>(
                ['hotQuotes', 10],
                (oldData) => {
                    if (!oldData?.quotes) return oldData;

                    return {
                        ...oldData,
                        quotes: oldData.quotes.map((quote) =>
                            quote.id === quoteId
                                ? { ...quote, vote_count: newVoteCount }
                                : quote
                        )
                    };
                }
            );
        };

        window.addEventListener('voteUpdated', handleVoteUpdate);
        return () => window.removeEventListener('voteUpdated', handleVoteUpdate);
    }, [queryClient]);

    return (
        <PageComponentContainer>
            {hotData?.quotes && hotData.quotes.map((quote: Quote, index: number) => (
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