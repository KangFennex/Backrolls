'use client'

import { Quote } from '../../../lib/definitions';
import { useNavigationContext } from '../../../context/NavigationContext';
import { trpc } from '../../../lib/trpc';
import { useEffect, useRef, useState } from 'react';
import { BackrollCardPicture2 } from '../../backrollCards/BackrollCardPicture2';
import './WorkroomHorizontalSection.scss';
import { MdChevronRight, MdChevronLeft, MdClose } from 'react-icons/md';
import { FaExpandAlt } from "react-icons/fa";
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
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);

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

    const handleExpandClick = () => {
        setIsFullscreen(true);
        setCurrentCardIndex(0);
        document.body.style.overflow = 'hidden';
    };

    const handleCloseFullscreen = () => {
        setIsFullscreen(false);
        document.body.style.overflow = 'auto';
    };

    const handleNextCard = () => {
        if (currentCardIndex < allQuotes.length - 1) {
            setCurrentCardIndex(prev => prev + 1);
        } else if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
            setCurrentCardIndex(prev => prev + 1);
        }
    };

    const handlePrevCard = () => {
        if (currentCardIndex > 0) {
            setCurrentCardIndex(prev => prev - 1);
        }
    };

    // Keyboard navigation in fullscreen
    useEffect(() => {
        if (!isFullscreen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                handleCloseFullscreen();
            } else if (e.key === 'ArrowRight') {
                handleNextCard();
            } else if (e.key === 'ArrowLeft') {
                handlePrevCard();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isFullscreen, currentCardIndex, allQuotes.length, hasNextPage, isFetchingNextPage]);

    const SectionTitle = ({ title }: { title: string }) => {
        return (
            <div className="whs-title flex justify-start items-center gap-2">
                <BackrollsLogoSmall />
                <h3 className="tektur vertical-column-title hover:text-pink-500 transition-all duration-300 ease-in-out pl-2 md:pl-0">{title}</h3>
                <FaExpandAlt
                    size={20}
                    className="text-[#8a8a8a] cursor-pointer transition-transform duration-300 hover:scale-[1.1] hover:text-pink-400"
                    onClick={handleExpandClick}
                />
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
        <>
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

            {/* Fullscreen Modal */}
            {isFullscreen && (
                <div className="whs-fullscreen-overlay">
                    <div className="whs-fullscreen-content">
                        {/* Close Button */}
                        <button
                            onClick={handleCloseFullscreen}
                            className="whs-fullscreen-close"
                            aria-label="Close fullscreen"
                        >
                            <MdClose size={28} />
                        </button>

                        {/* Previous Button */}
                        {currentCardIndex > 0 && (
                            <button
                                onClick={handlePrevCard}
                                className="whs-fullscreen-nav whs-fullscreen-nav-left"
                                aria-label="Previous card"
                            >
                                <MdChevronLeft size={40} />
                            </button>
                        )}

                        {/* Card Display */}
                        <div className="whs-fullscreen-card-container">
                            {allQuotes[currentCardIndex] && (
                                <div className="whs-fullscreen-card">
                                    <BackrollCardPicture2
                                        quote={allQuotes[currentCardIndex]}
                                        onClick={() => handleClick(allQuotes[currentCardIndex])}
                                        isFullScreen={true}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Next Button */}
                        {(currentCardIndex < allQuotes.length - 1 || hasNextPage) && (
                            <button
                                onClick={handleNextCard}
                                className="whs-fullscreen-nav whs-fullscreen-nav-right"
                                aria-label="Next card"
                                disabled={isFetchingNextPage && currentCardIndex >= allQuotes.length - 1}
                            >
                                <MdChevronRight size={40} />
                            </button>
                        )}

                        {/* Card Counter */}
                        <div className="whs-fullscreen-counter">
                            {currentCardIndex + 1} / {allQuotes.length}{hasNextPage ? '+' : ''}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
