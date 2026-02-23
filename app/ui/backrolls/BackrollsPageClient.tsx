'use client'

import { useSearchParams } from 'next/navigation';
import { BackrollCardSlim } from '../backrollCards/BackrollCardSlim';
import { useNavigationContext } from '../../context/NavigationContext';
import PageComponentContainer from '../shared/pageComponentContainer';
import { SectionSkeleton } from '../shared/skeletons';
import { Quote } from '../../lib/definitions';
import { trpc } from '../../lib/trpc';

export default function BackrollsPageClient() {
    const searchParams = useSearchParams();
    const searchQuery = searchParams.get('search');
    const { navigateToBackroll } = useNavigationContext();

    // Fetch search results if there's a search query
    const { data: searchResults, isLoading } = trpc.quotes.search.useQuery(
        { query: searchQuery || '' },
        { enabled: !!searchQuery }
    );

    const quotes = searchResults || [];

    const handleClick = (quote: Quote) => {
        navigateToBackroll(quote);
    };

    if (!searchQuery) {
        return (
            <PageComponentContainer>
                <div className="text-center py-8 text-gray-500">
                    Use the search bar to find quotes
                </div>
            </PageComponentContainer>
        );
    }

    if (isLoading) {
        return (
            <PageComponentContainer>
                <SectionSkeleton />
            </PageComponentContainer>
        );
    }

    const displayResultLength = () => {
        const resultsLength = quotes.length;
        return (
            <div>
                <h2 className="text-xl font-semibold mb-4 ml-4 ghost-white">
                    Found {resultsLength} backrolls
                </h2>
            </div>
        );
    }

    if (quotes.length === 0) {
        return (
            <PageComponentContainer>
                <div className="text-center py-8 ghost-white">
                    No results found for &quot;{searchQuery}&quot;
                </div>
            </PageComponentContainer>
        );
    }

    return (
        <>
            {displayResultLength()}
            <PageComponentContainer>
                {quotes.map((quote) => (
                    <div key={quote.id}>
                        <BackrollCardSlim
                            quote={quote}
                            onClick={() => handleClick(quote)}
                        />
                    </div>
                ))}
            </PageComponentContainer>
        </>
    );
}