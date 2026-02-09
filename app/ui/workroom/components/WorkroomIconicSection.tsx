'use client'

import { Quote } from '../../../lib/definitions';
import { useState } from 'react';
import Image from 'next/image';
import { getSpeakerImageWithFallback } from '../../../lib/utils';
import '@/app/scss/pages/WorkroomIconicSection.scss';

interface WorkroomIconicSectionProps {
    initialData: {
        quotes: Quote[];
        nextCursor?: string;
        seed: number;
    };
}

export default function WorkroomIconicSection({ initialData }: WorkroomIconicSectionProps) {
    // Use all available quotes
    const allQuotes = initialData.quotes;

    const [currentQuote, setCurrentQuote] = useState<Quote>(allQuotes[0]);
    const [deckQuotes, setDeckQuotes] = useState<Quote[]>(allQuotes.slice(1, 5)); // Cards 2-5 (4 cards)
    const [nextQuoteIndex, setNextQuoteIndex] = useState(5); // Next quote to add to deck
    const [removingCardIndex, setRemovingCardIndex] = useState<number | null>(null);

    const handleCardClick = (clickedIndex: number) => {
        if (removingCardIndex !== null) return;

        // Set the removing animation
        setRemovingCardIndex(clickedIndex);

        // Wait for animation to complete
        setTimeout(() => {
            const clickedQuote = deckQuotes[clickedIndex];

            // Update current quote to the clicked card's quote
            setCurrentQuote(clickedQuote);

            // Remove the clicked card from deck
            const newDeck = [...deckQuotes];
            newDeck.splice(clickedIndex, 1);

            // Add a new card to maintain 4 cards
            if (nextQuoteIndex < allQuotes.length) {
                newDeck.push(allQuotes[nextQuoteIndex]);
                setNextQuoteIndex(nextQuoteIndex + 1);
            } else if (newDeck.length < 4 && allQuotes.length >= 5) {
                // Loop back to beginning if we run out
                const loopIndex = nextQuoteIndex % allQuotes.length;
                newDeck.push(allQuotes[loopIndex]);
                setNextQuoteIndex(loopIndex + 1);
            }

            setDeckQuotes(newDeck);
            setRemovingCardIndex(null);
        }, 600); // Match animation duration
    };

    if (!currentQuote) {
        return null;
    }

    return (
        <section className="iconic-section">
            <span className="quote-mark">&ldquo;</span>

            <div className="iconic-quote-container">
                <p className="iconic-quote-text backrollCard-font">
                    {currentQuote.quote_text}
                </p>
                <p className="iconic-quote-attribution">
                    — {currentQuote.speaker} {currentQuote.series && `from ${currentQuote.series}, S${String(currentQuote.season).padStart(2, '0')}E${String(currentQuote.episode).padStart(2, '0')}`}
                </p>
            </div>

            {deckQuotes.length > 0 && (
                <div className="card-deck">
                    {deckQuotes.map((quote, index) => {
                        const speakerImage = getSpeakerImageWithFallback(quote.speaker);
                        const cardNumber = index + 2; // Start numbering from 2

                        return (
                            <div
                                key={`${quote.id}-${index}`}
                                className={`deck-card ${removingCardIndex === index ? 'removing' : ''}`}
                                onClick={() => handleCardClick(index)}
                                style={{
                                    pointerEvents: removingCardIndex !== null ? 'none' : 'auto'
                                }}
                            >
                                <Image
                                    src={speakerImage}
                                    alt={quote.speaker}
                                    className="card-image"
                                    fill
                                    style={{ objectFit: 'cover' }}
                                    unoptimized
                                />
                                <div className="card-number">{cardNumber}</div>
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
}
