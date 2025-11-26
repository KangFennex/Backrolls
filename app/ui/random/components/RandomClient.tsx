'use client'

import { useState, useEffect } from 'react';
import { Quote } from '../../../lib/definitions';
import { BackrollCard } from '../../backrollCards/BackrollCard';
import { useNavigationContext } from '../../../context/NavigationContext';
import { RandomClientProps } from '../../../lib/definitions';
import PageComponentContainer from '../../pageComponentContainer';

export default function RandomClient({ randomQuotes }: RandomClientProps) {
    const { navigateToBackroll } = useNavigationContext();
    const [quotes, setQuotes] = useState<Quote[]>(randomQuotes || []);

    // Update quotes when randomQuotes prop changes (e.g., when limit changes)
    useEffect(() => {
        setQuotes(randomQuotes || []);
    }, [randomQuotes]);

    const handleClick = (quote: Quote) => {
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
                No quotes found.
            </div>
        );
    }

    return (
        <PageComponentContainer>
            {quotes.map((quote) => (
                <div key={quote.id}>
                    <BackrollCard
                        quote={quote}
                        variant="full"
                        onClick={() => handleClick(quote)}
                        mosaic={false}
                    />
                </div>
            ))}
        </PageComponentContainer>
    )
}