'use client'

import { Quote } from '../../lib/definitions';
import { BackrollCard } from '../backrollCards/BackrollCard';
import { useNavigationContext } from '../../context/NavigationContext';
import PageComponentContainer from '../pageComponentContainer';
import { getMosaicClass } from '../../lib/utils';
import { trpc } from '../../lib/trpc';
import { useEffect, useRef, useState } from 'react';

interface WorkroomPageClientProps {
    initialData: {
        quotes: Quote[];
        nextCursor?: string;
        seed: number;
    };
}

export default function WorkroomPageClient({ initialData }: WorkroomPageClientProps) {
    const { navigateToBackroll } = useNavigationContext();
    const [allQuotes, setAllQuotes] = useState<Quote[]>(initialData.quotes);
    const [cursor, setCursor] = useState<string | undefined>(initialData.nextCursor);
    const [seed] = useState(initialData.seed);
    const observerTarget = useRef<HTMLDivElement>(null);
    
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = trpc.quotes.getRandom.useInfiniteQuery(
        { limit: 30, seed },
        {
            initialData: {
                pages: [initialData],
                pageParams: [undefined],
            },
            getNextPageParam: (lastPage) => lastPage.nextCursor,
            refetchOnWindowFocus: false,
            staleTime: 1000 * 60 * 5, // 5 minutes
        }
    );

    // Update quotes when new pages are fetched
    useEffect(() => {
        if (data) {
            const quotes = data.pages.flatMap(page => page.quotes);
            setAllQuotes(quotes);
            const lastPage = data.pages[data.pages.length - 1];
            setCursor(lastPage.nextCursor);
        }
    }, [data]);

    // Intersection Observer for infinite scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                    fetchNextPage();
                }
            },
            { threshold: 0.1, rootMargin: '100px' }
        );

        const currentTarget = observerTarget.current;
        if (currentTarget) {
            observer.observe(currentTarget);
        }

        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget);
            }
        };
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    const useMosaic = allQuotes.length > 8;

    const handleClick = (quote: Quote) => {
        navigateToBackroll(quote);
    };

    if (allQuotes.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                No backrolls for you today
            </div>
        );
    }

    return (
        <>
            <PageComponentContainer variant={useMosaic ? 'mosaic' : 'list'}>
                {allQuotes.map((quote: Quote, index: number) => (
                    <div
                        key={quote.id}
                        className={useMosaic ? getMosaicClass(quote.quote_text, index) : ''}
                    >
                        <BackrollCard
                            quote={quote}
                            variant="full"
                            onClick={() => handleClick(quote)}
                        />
                    </div>
                ))}
            </PageComponentContainer>
            
            {/* Loading indicator and infinite scroll trigger */}
            <div ref={observerTarget} className="w-full py-8 flex justify-center">
                {isFetchingNextPage && (
                    <div className="flex flex-col items-center gap-3">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
                        <p className="text-sm text-gray-400">Loading more backrolls...</p>
                    </div>
                )}
                {!hasNextPage && allQuotes.length > 0 && (
                    <p className="text-sm text-gray-500 italic">You've reached the end! 🎭</p>
                )}
            </div>
        </>
    );
}
