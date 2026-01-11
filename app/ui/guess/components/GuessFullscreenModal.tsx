'use client'

import { Quote } from '@/app/lib/definitions';
import { BackrollCardPicture2 } from '../../backrollCards/BackrollCardPicture2';
import { MdChevronLeft, MdChevronRight, MdClose } from 'react-icons/md';
import '@/app/scss/pages/WorkroomHorizontalSection.scss';

interface GuessFullscreenModalProps {
    allQuotes: Quote[];
    currentCardIndex: number;
    useFilters: boolean;
    hasNextRandom: boolean;
    onClose: () => void;
    onQuoteClick: (quote: Quote) => void;
    onPrevCard: () => void;
    onNextCard: () => void;
}

export default function GuessFullscreenModal({
    allQuotes,
    currentCardIndex,
    useFilters,
    hasNextRandom,
    onClose,
    onQuoteClick,
    onPrevCard,
    onNextCard
}: GuessFullscreenModalProps) {
    return (
        <div className="whs-fullscreen-overlay">
            <div className="whs-fullscreen-content">
                <button
                    onClick={onClose}
                    className="whs-fullscreen-close"
                    aria-label="Close fullscreen"
                >
                    <MdClose size={28} />
                </button>

                <div className="whs-fullscreen-card-container">
                    {allQuotes[currentCardIndex] && (
                        <div className="whs-fullscreen-card">
                            <BackrollCardPicture2
                                key={allQuotes[currentCardIndex].id}
                                quote={allQuotes[currentCardIndex]}
                                onClick={() => onQuoteClick(allQuotes[currentCardIndex])}
                                isFullScreen={true}
                            />
                        </div>
                    )}
                </div>

                <div className="whs-fullscreen-controls">
                    <button
                        onClick={onPrevCard}
                        className="whs-fullscreen-nav whs-fullscreen-nav-left"
                        aria-label="Previous card"
                        disabled={currentCardIndex === 0}
                    >
                        <MdChevronLeft size={24} />
                    </button>

                    <div className="whs-fullscreen-counter">
                        {currentCardIndex + 1} / {allQuotes.length}{!useFilters && hasNextRandom ? '+' : ''}
                    </div>

                    <button
                        onClick={onNextCard}
                        className="whs-fullscreen-nav whs-fullscreen-nav-right"
                        aria-label="Next card"
                        disabled={useFilters && currentCardIndex >= allQuotes.length - 1}
                    >
                        <MdChevronRight size={24} />
                    </button>
                </div>
            </div>
        </div>
    );
}
