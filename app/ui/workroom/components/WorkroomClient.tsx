'use client'

import { Quote } from '../../../lib/definitions';
import { useEffect, useState } from 'react';
import { BackrollCard } from '../../backrolls/BackrollCard';
import { useNavigationContext } from '../../../context/NavigationContext';

interface WorkroomClientProps {
    initialQuotes: Quote[];
}

export function WorkroomClient({ initialQuotes }: WorkroomClientProps) {
    const { navigateToBackroll } = useNavigationContext();
    const [quotes, setQuotes] = useState<Quote[]>(initialQuotes);

    const handleQuoteClick = (quote: Quote) => {
        navigateToBackroll(quote);
    };

    // Listen for vote updates
    useEffect(() => {
        const handleVoteUpdate = (event: Event) => {
            const customEvent = event as CustomEvent;
            const { quoteId, newVoteCount } = customEvent.detail;

            setQuotes(currentQuotes =>
                currentQuotes.map(quote =>
                    quote.id === quoteId
                        ? { ...quote, vote_count: newVoteCount }
                        : quote
                )
            );
        };

        window.addEventListener('voteUpdated', handleVoteUpdate);
        return () => window.removeEventListener('voteUpdated', handleVoteUpdate);
    }, []);

    if (quotes.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                No quotes found for the selected filters.
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col justify-center space-y-4 mt-6">
            {quotes.map((quote, index) => (
                <div key={quote.id} className="flex-shrink-0 min-w-[250px]">
                    <BackrollCard
                        quote={quote}
                        variant="full"
                        index={index}
                        onDoubleClick={() => handleQuoteClick(quote)}
                    />
                </div>
            ))}
        </div>
    );
}