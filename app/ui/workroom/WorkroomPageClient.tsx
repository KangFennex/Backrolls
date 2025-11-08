'use client'

import { Quote } from '../../lib/definitions';
import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query';
import { useWorkroomQuotes } from '../../lib/hooks';
import { BackrollCard } from '../backrollCards/BackrollCard';
import { useNavigationContext } from '../../context/NavigationContext';
import PageComponentContainer from '../pageComponentContainer';
import { usePathname } from 'next/navigation';

export default function WorkroomPageClient() {
    const { navigateToBackroll } = useNavigationContext();
    const { data: randomData } = useWorkroomQuotes(30);
    const queryClient = useQueryClient();
    const pathname = usePathname();

    const isMainPage = pathname === '/';

    const handleClick = (quote: Quote) => {
        navigateToBackroll(quote);
    }

    useEffect(() => {
        const handleVoteUpdate = (event: Event) => {
            const customEvent = event as CustomEvent;
            const { quoteId, newVoteCount } = customEvent.detail;

            // Updates the TanStack Query cache directly
            queryClient.setQueryData<{ quote: Quote[] }>(
                ['workroomQuotes', 30],
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
        };

        window.addEventListener('voteUpdated', handleVoteUpdate);
        return () => window.removeEventListener('voteUpdated', handleVoteUpdate);
    }, [queryClient]);

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
                <div key={quote.id} className={`${isMainPage ? 'w-full md:w-auto' : 'flex-shrink-0 min-w-[250px]'}`}>
                    <BackrollCard
                        quote={quote}
                        variant="full"
                        index={index}
                        onClick={() => handleClick(quote)}
                        isMainPage={isMainPage}
                    />
                </div>
            ))}
        </PageComponentContainer>
    );
}
