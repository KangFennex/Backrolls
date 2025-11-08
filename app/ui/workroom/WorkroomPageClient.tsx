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

    // Assign card size based on quote text length with some randomness
    const getMosaicClass = (quote: Quote, index: number) => {
        if (!isMainPage) return '';

        const textLength = quote.quote_text.length;
        
        // Use index for pseudo-random distribution while keeping consistency
        const variant = index % 5;

        // Very long quotes (100+ chars) - always get large or wide
        if (textLength > 100) {
            return variant === 0 ? 'card-large' : 'card-wide';
        }

        // Long quotes (70-100 chars) - mostly wide, some large
        if (textLength > 70) {
            return variant < 2 ? 'card-wide' : variant === 2 ? 'card-large' : 'card-tall';
        }

        // Medium-long quotes (50-70 chars) - mix of wide and tall
        if (textLength > 50) {
            return variant === 0 ? 'card-wide' : variant < 3 ? 'card-tall' : '';
        }

        // Medium quotes (30-50 chars) - mostly tall, some normal
        if (textLength > 30) {
            return variant < 2 ? 'card-tall' : '';
        }

        // Short quotes (< 30 chars) - mostly normal, occasional tall
        return variant === 0 ? 'card-tall' : '';
    };

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
                <div
                    key={quote.id}
                    className={`${isMainPage ? getMosaicClass(quote, index) : 'flex-shrink-0 min-w-[250px]'}`}
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
