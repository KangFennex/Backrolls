'use client'

import { useState, useEffect } from 'react';
import { Quote } from '../../../lib/definitions';
import { BackrollCardSlim } from '../../backrollCards/BackrollCardSlim';
import { useNavigationContext } from '../../../context/NavigationContext';
import { RandomClientProps } from '../../../lib/definitions';
import { useRouter } from 'next/navigation';
import { TbArrowsRandom } from "react-icons/tb";
import { useRainbowColors } from '../../../lib/hooks';
import { PageSectionHeader } from '../../shared/PageSectionHeader';

// Quote count options
const QUOTE_LIMIT_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export default function RandomClient({ randomQuotes }: RandomClientProps) {
    const { navigateToBackroll } = useNavigationContext();
    const router = useRouter();
    const { getColorForIcon } = useRainbowColors();
    const [quotes, setQuotes] = useState<Quote[]>(randomQuotes || []);
    const [selectedLimit, setSelectedLimit] = useState<number>(randomQuotes?.length || 1);

    // Update quotes when limit changes
    useEffect(() => {
        setQuotes(randomQuotes || []);
        setSelectedLimit(randomQuotes?.length || 1);
    }, [randomQuotes]);

    const handleClick = (quote: Quote) => {
        navigateToBackroll(quote);
    };

    const handleRefresh = () => {
        router.push(`/random?limit=${selectedLimit}`);
    };

    const handleLimitChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newLimit = Number(event.target.value);
        setSelectedLimit(newLimit);
        // Automatically refresh when user selects a new number
        router.push(`/random?limit=${newLimit}`);
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
            <>
                <div className="flex items-center justify-center gap-3 mb-6 pt-4">
                    <select
                        id="quote-limit"
                        value={selectedLimit}
                        onChange={handleLimitChange}
                        className="px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent cursor-pointer transition-all duration-200 hover:bg-gray-750 hover:border-purple-500 select-none"
                        style={{
                            WebkitAppearance: 'none',
                            MozAppearance: 'none',
                            appearance: 'none'
                        }}
                    >
                        {QUOTE_LIMIT_OPTIONS.map((num) => (
                            <option key={num} value={num}>
                                {num}
                            </option>
                        ))}
                    </select>
                    <TbArrowsRandom
                        title="Refresh Random Quotes"
                        size={30}
                        onClick={handleRefresh}
                        style={{ color: getColorForIcon(4), cursor: 'pointer' }}
                        className="random-icon"
                    />
                </div>
                <div className="text-center py-8 text-gray-500">
                    No quotes found.
                </div>
            </>
        );
    }

    return (
        <div className="w-full min-w-full h-screen">
            <PageSectionHeader title="Random Backrolls" />
            <div className="flex items-center justify-center gap-3 mb-6 pt-4">
                <select
                    id="quote-limit"
                    value={selectedLimit}
                    onChange={handleLimitChange}
                    className="px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent cursor-pointer transition-all duration-200 hover:bg-gray-750 hover:border-purple-500 select-none"
                    style={{
                        WebkitAppearance: 'none',
                        MozAppearance: 'none',
                        appearance: 'none',
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='white' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 0.75rem center',
                        paddingRight: '2.5rem'
                    }}
                >
                    {QUOTE_LIMIT_OPTIONS.map((num) => (
                        <option key={num} value={num}>
                            {num}
                        </option>
                    ))}
                </select>
                <TbArrowsRandom
                    title="Refresh Random Quotes"
                    size={30}
                    onClick={handleRefresh}
                    style={{ color: getColorForIcon(4), cursor: 'pointer' }}
                    className="random-icon"
                />
            </div>
            <div className="w-full flex flex-col px-4">
                {quotes.map((quote) => (
                    <div key={quote.id}>
                        <BackrollCardSlim
                            quote={quote}
                            onClick={() => handleClick(quote)}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}