'use client';

import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query';;
import { BackrollCard } from '..//backrollCards/BackrollCard';
import { useNavigationContext } from '../../context/NavigationContext';
import { useFreshQuotes } from '../../lib/hooks';
import PageComponentContainer from '../pageComponentContainer';
import { Quote } from '../../lib/definitions';

export default function FreshPageClient() {
    const { navigateToBackroll } = useNavigationContext();
    const { data: freshData } = useFreshQuotes();
    const queryClient = useQueryClient();

    const handleClick = (quote: Quote) => {
        navigateToBackroll(quote);
    }

    useEffect(() => {
        const handleVoteUpdate = (event: Event) => {
            const customEvent = event as CustomEvent;
            const { quoteId, newVoteCount } = customEvent.detail;

            queryClient.setQueryData<{ quote: Quote[] }>(
                ['freshQuotes'],
                (oldData) => {
                    if (!oldData?.quote) return oldData;

                    return {
                        ...oldData,
                        quote: oldData.quote.map((quote) =>
                            quote.id === quoteId
                                ? { ...quote, vote_count: newVoteCount }
                                : quote
                        )
                    };
                }
            );

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
