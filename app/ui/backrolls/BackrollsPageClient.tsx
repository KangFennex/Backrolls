'use client'

import { useSearchParams } from 'next/navigation';
import { BackrollCard } from '..//backrollCards/BackrollCard';
import { useNavigationContext } from '../../context/NavigationContext';
import PageComponentContainer from '../pageComponentContainer';
import { SectionSkeleton } from '../skeletons';
import { Quote } from '../../lib/definitions';
import { trpc } from '../../lib/trpc';
import { getMosaicClass } from '../../lib/utils';

export default function BackrollsPageClient() {
    const searchParams = useSearchParams();
    const searchQuery = searchParams.get('search');
    const { navigateToBackroll } = useNavigationContext();

    // Fetch search results if there's a search query
    const { data: searchResults, isLoading } = trpc.quotes.search.useQuery(
        { query: searchQuery || '' },
        { enabled: !!searchQuery }
    );

    const useMosaic = searchResults && searchResults.length > 8;

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
        <PageComponentContainer variant={useMosaic ? 'mosaic' : 'list'}>
            {quotes.map((quote, index) => (
                <div key={quote.id} className={useMosaic ? getMosaicClass(quote.quote_text, index) : ''}>
                    <BackrollCard
                        quote={quote}
                        variant="full"
                        onClick={() => handleClick(quote)}
                        mosaic={useMosaic}
                    />
                </div>
            ))}
        </PageComponentContainer>
    );
}