'use client'

import { useSearchParams } from 'next/navigation';
import { BackrollCardSlim2 } from '../backrollCards/BackrollCardSlim2';
import { useNavigationContext } from '../../context/NavigationContext';
import PageComponentContainer from '../pageComponentContainer';
import { SectionSkeleton } from '../skeletons';
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

    const handleClick = (quote: Quote) => {
        navigateToBackroll(quote);
    }

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

    const quotes = searchResults || [];

    if (quotes.length === 0) {
        return (
            <PageComponentContainer>
                <div className="text-center py-8 text-gray-500">
                    No results found for &quot;{searchQuery}&quot;
                </div>
            </PageComponentContainer>
        );
    }

    return (
        <PageComponentContainer>
            {quotes.map((quote) => (
                <div key={quote.id}>
                    <BackrollCardSlim2
                        quote={quote}
                        onClick={() => handleClick(quote)}
                    />
                </div>
            ))}
        </PageComponentContainer>
    );
}