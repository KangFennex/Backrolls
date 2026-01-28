import type { Quote } from '../../lib/definitions';
import { QuoteActionButtons } from '../shared/ActionButtons';

export function BackrollCardMinimal({
    quote,
    onClick,
}: {
    quote: Quote;
    onClick: () => void;
}) {
    const quoteLength = quote.quote_text.trim().length;
    const quoteMaxLength = 100;
    const isQuoteLong = quoteLength > quoteMaxLength;

    const handleQuoteLong = (quote: Quote) => {
        return quote.quote_text.length > quoteMaxLength
            ? quote.quote_text.slice(0, quoteMaxLength) + '...'
            : quote.quote_text;
    }

    return (
        <div
            className="w-full h-full cursor-pointer border-t border-white/15 transition-colors hover:bg-white/5 rounded-md"
            onClick={onClick}
        >
            <div className="h-full flex flex-col gap-3 py-4 px-3">
                {/* Quote Text */}
                <div className="flex-1">
                    <p className="backrollCard-font text-xl leading-relaxed line-clamp-3">
                        {isQuoteLong ? handleQuoteLong(quote) : quote.quote_text}
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex-shrink-0 mt-auto">
                    <QuoteActionButtons
                        quoteId={quote.id}
                        quoteText={quote.quote_text}
                        initialVoteCount={quote.vote_count}
                        onCommentClick={onClick}
                    />
                </div>
            </div>
        </div>
    );
}
