'use client';

import { Quote } from "../../../lib/definitions";

interface LoungeQuoteCardProps {
    quote: Quote;
    variant?: 'favorites' | 'submitted' | 'commented';
    commentText?: string;
}

export default function LoungeQuoteCard({ quote, variant = 'favorites', commentText }: LoungeQuoteCardProps) {
    return (
        <div className="lounge-quote-card">
            <div className="lounge-quote-card__content">
                {/* Quote Text */}
                <p className="lounge-quote-card__quote backrollCard-font">
                    &ldquo;{quote.quote_text}&rdquo;
                </p>

                {/* Speaker */}
                <p className="lounge-quote-card__speaker">
                    — {quote.speaker}
                </p>

                {/* Episode Info */}
                <div className="lounge-quote-card__meta">
                    <span>{quote.series}</span>
                    <span>•</span>
                    <span>S{quote.season}E{quote.episode}</span>
                </div>

                {/* Conditional Elements Based on Variant */}
                {variant === 'submitted' && (
                    <div className="lounge-quote-card__status">
                        <span className={`status-badge ${quote.is_approved ? 'status-badge--approved' : 'status-badge--pending'}`}>
                            {quote.is_approved ? 'Approved' : 'Pending'}
                        </span>
                    </div>
                )}

                {variant === 'commented' && commentText && (
                    <div className="lounge-quote-card__comment">
                        <p className="backrollCard-font">{commentText}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
