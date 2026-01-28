'use client';

import { Quote } from "../../lib/definitions";

export default function SearchResults({
    searchResults,
    handleSetBackroll
}: {
    searchResults: Quote[];
    handleSetBackroll: (quote: Quote) => void;
}) {
    if (searchResults.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <div className="text-4xl mb-4">🔍</div>
                <p className="text-lg">No quotes found</p>
                <p className="text-sm">Try different keywords</p>
            </div>
        );
    }

    return (
        <div className="search-results overflow-hidden">
            <div className="mb-4 px-2">
                <p className="text-sm font-medium" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                    {searchResults.length} quote{searchResults.length !== 1 ? 's' : ''} found
                </p>
            </div>

            <div className="flex flex-col gap-2 max-h-96 overflow-y-auto">
                {searchResults.map((quote) => (
                    <SearchResult
                        key={quote.id}
                        quote={quote.quote_text}
                        onClick={() => handleSetBackroll(quote)}
                    />
                ))}
            </div>
        </div>
    );
}

function SearchResult({
    quote,
    onClick
}: {
    quote: string;
    onClick: () => void;
}) {

    const truncatedQuote = quote.length > 80
        ? quote.substring(0, 80).trim() + "..."
        : quote;

    return (
        <div
            onClick={onClick}
            className="search-result-item cursor-pointer transition-all duration-150 ease-out rounded-lg"
        >
            <p className="text-[var(--cool-ghost-white)] font-medium leading-relaxed transition-colors duration-150 p-3"
                style={{
                    fontFamily: "'Google Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
                }}>
                {truncatedQuote}
            </p>
        </div >
    );
}