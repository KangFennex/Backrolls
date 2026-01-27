'use client'

import { RefObject } from 'react';
import { Quote } from '@/app/lib/definitions';
import { BackrollCardPicture } from '../../backrollCards/BackrollCardPicture';
import BackrollCardVerticalSkeleton from '../../backrollCards/BackrollCardVerticalSkeleton';
import { MdChevronRight } from 'react-icons/md';
import '@/app/scss/pages/WorkroomHorizontalSection.scss';

interface GuessCardsSectionProps {
    allQuotes: Quote[];
    scrollContainerRef: RefObject<HTMLDivElement | null>;
    observerTarget: RefObject<HTMLDivElement | null>;
    useFilters: boolean;
    isFetchingRandom: boolean;
    onQuoteClick: (quote: Quote) => void;
    onScrollRight: () => void;
}

export default function GuessCardsSection({
    allQuotes,
    scrollContainerRef,
    observerTarget,
    useFilters,
    isFetchingRandom,
    onQuoteClick,
    onScrollRight
}: GuessCardsSectionProps) {
    return (
        <section className="workroom-horizontal-section">
            <div
                ref={scrollContainerRef}
                className="whs-scroll-container"
            >
                <div className="whs-cards-row">
                    {allQuotes.map((quote: Quote) => (
                        <div key={quote.id} className="whs-card-wrapper">
                            <BackrollCardPicture
                                quote={quote}
                                onClick={() => onQuoteClick(quote)}
                            />
                        </div>
                    ))}

                    {/* Loading indicator for infinite scroll */}
                    {!useFilters && (
                        <div ref={observerTarget} className="whs-loading-trigger">
                            {isFetchingRandom && (
                                <div className="whs-loading" style={{ display: 'flex', gap: '1rem' }}>
                                    {Array.from({ length: 3 }).map((_, i) => (
                                        <div key={i} className="whs-card-wrapper">
                                            <BackrollCardVerticalSkeleton />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Scroll Right Arrow */}
            <button
                onClick={onScrollRight}
                className="whs-scroll-arrow"
                aria-label="Scroll right"
            >
                <MdChevronRight size={32} />
            </button>
        </section>
    );
}
