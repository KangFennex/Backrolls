'use client'

import { useEffect, useState } from 'react';
import { BackrollCard } from '../../backrollCards/BackrollCard';
import { Quote } from '../../../lib/definitions';
import { useNavigationContext } from '../../../context/NavigationContext';
import PageComponentContainer from '../../pageComponentContainer';

export default function BackrollsClient({ displayResults }: { displayResults: Quote[] }) {
    const { navigateToBackroll } = useNavigationContext();
    const [quotes, setQuotes] = useState<Quote[]>(displayResults);
    
    // Debug logging
    console.log('BackrollsClient - displayResults prop:', displayResults);
    console.log('BackrollsClient - quotes state:', quotes);
    
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
            {quotes.map((quote, index) => (
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
