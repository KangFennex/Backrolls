'use client'

import { Quote } from '../../../lib/definitions';
import { useNavigationContext } from '../../../context/NavigationContext';
import { trpc } from '../../../lib/trpc';
import { useEffect, useRef, useState } from 'react';
import { BackrollCardPicture2 } from '../../backrollCards/BackrollCardPicture2';
import './WorkroomHorizontalSection.scss';
import { MdChevronRight } from 'react-icons/md';
import BackrollCardVerticalSkeleton from '../../backrollCards/BackrollCardVerticalSkeleton';
import { BackrollsLogoSmall } from '../../shared/BackrollsLogo';

interface WorkroomHorizontalSectionProps {
    initialData: {
        quotes: Quote[];
        nextCursor?: string;
        seed: number;
    };
}

export default function WorkroomHorizontalSection({ initialData }: WorkroomHorizontalSectionProps) {
    const { navigateToBackroll } = useNavigationContext();
    const [allQuotes, setAllQuotes] = useState<Quote[]>(initialData.quotes);
    const [seed] = useState(initialData.seed);
    const observerTarget = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = trpc.quotes.getRandom.useInfiniteQuery(
        { limit: 15, seed },
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
        }
    }, [data]);

    // Intersection Observer for horizontal infinite scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                    fetchNextPage();
                }
            },
            {
                threshold: 0.1,
                rootMargin: '0px 200px 0px 0px', // Right margin for horizontal scroll
                root: scrollContainerRef.current
            }
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

    const handleClick = (quote: Quote) => {
        navigateToBackroll(quote);
    };

    const handleScrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({
                left: 400,
                behavior: 'smooth'
            });
        }
    };

    const SectionTitle = ({ title }: { title: string }) => {
        return (
            <div className="whs-title flex items-center gap-2">
                <BackrollsLogoSmall />
                <h3 className="tektur vertical-column-title mr-auto hover:text-pink-500 transition-all duration-300 ease-in-out pl-2 md:pl-0">{title}</h3>
            </div>
        )
    }

    if (allQuotes.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                No backrolls for you today
            </div>
        );
    }

    return (
        <section className="workroom-horizontal-section">
            <SectionTitle title="Guess the Queen" />
            <div
                ref={scrollContainerRef}
                className="whs-scroll-container"
            >
                <div className="whs-cards-row">
                    {allQuotes.map((quote: Quote) => (
                        <div key={quote.id} className="whs-card-wrapper">
                            <BackrollCardPicture2
                                quote={quote}
                                onClick={() => handleClick(quote)}
                            />
                        </div>
                    ))}

                    {/* Must change the skeleton below to adjust to new picture card */}
                    {/* Loading indicator and infinite scroll trigger */}
                    <div ref={observerTarget} className="whs-loading-trigger">
                        {isFetchingNextPage && (
                            <div className="whs-loading" style={{ display: 'flex', gap: '1rem' }}>
                                {Array.from({ length: 3 }).map((_, i) => (
                                    <div key={i} className="whs-card-wrapper">
                                        <BackrollCardVerticalSkeleton />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Scroll Right Arrow */}
            <button
                onClick={handleScrollRight}
                className="whs-scroll-arrow"
                aria-label="Scroll right"
            >
                <MdChevronRight size={32} />
            </button>
        </section>
    );
}
