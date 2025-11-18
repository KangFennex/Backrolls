'use client'

import { Quote } from '../../lib/definitions';
import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query';
import { useWorkroomQuotes } from '../../lib/hooks';
import { BackrollCard } from '../backrollCards/BackrollCard';
import { useNavigationContext } from '../../context/NavigationContext';
import PageComponentContainer from '../pageComponentContainer';
import { usePathname } from 'next/navigation';
import { getMosaicClass } from '../../lib/utils';

export default function WorkroomPageClient() {
    const { navigateToBackroll } = useNavigationContext();
    const { data: quotes, isLoading } = useWorkroomQuotes(30);
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

            // Updates the TanStack Query cache directly - tRPC returns array directly
            queryClient.setQueryData<Quote[]>(
                [['quotes', 'getRandom'], { input: { limit: 30 } }],
                (oldData) => {
                    if (!oldData) return oldData;

                    return oldData.map((quote) =>
                        quote.id === quoteId
                            ? { ...quote, voteCount: newVoteCount }
                            : quote
                    );
                }
            );
        };

        window.addEventListener('voteUpdated', handleVoteUpdate);
        return () => window.removeEventListener('voteUpdated', handleVoteUpdate);
    }, [queryClient]);

    if (isLoading) {
        return (
            <div className="text-center py-8 text-gray-500">
                Loading...
            </div>
        );
    }

    if (!quotes || quotes.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                No backrolls for you today
            </div>
        );
    }

    return (
        <PageComponentContainer variant={isMainPage ? 'mosaic' : 'list'}>
            {quotes.map((quote: Quote, index: number) => (
                <div
                    key={quote.id}
                    className={isMainPage ? getMosaicClass(quote.quote_text, index) : ''}
                >
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
