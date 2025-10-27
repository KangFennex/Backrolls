'use client';

import "./searchCards.scss";
import { FaShare } from "react-icons/fa";
import { FaRegCopy } from "react-icons/fa6";
import { FavoriteButton, VoteButtons } from "../buttons/buttons";
import { SearchCardsSkeleton } from "../skeletons";
import { CardWrapperProps, CardProps } from "../../lib/definitions";

/* export default function CardWrapper({
    searchResults,
    handleSetBackroll
}: CardWrapperProps) {

    return (
        <div className="card-wrapper w-full h-full pt-2">
            {searchResults.length > 0 && (
                <div className="search-results flex flex-col pt-4 gap-3 items-center overflow-y-auto">
                    {searchResults.map((quote) => (
                        <Card
                            key={quote.id}
                            id={quote.id}
                            quote={quote.quote_text}
                            speaker={quote.speaker}
                            season={quote.season}
                            episode={quote.episode}
                            onClick={() => handleSetBackroll(quote)}
                        />
                    ))}
                </div>
            )}
            {searchResults.length === 0 && (
                <div className="no-results flex flex-col items-center justify-center h-full">
                    <SearchCardsSkeleton />
                    <p className="text-[#e6e9ef] text-2xl mt-6">No results found</p>
                </div>
            )}
        </div>
    )
}

function Card({
    id,
    quote,
    season,
    episode,
    speaker,
    onClick
}: CardProps
) {
    return (
        <div className="speech-bubble relative w-[80%] active:scale-98 transition-transform duration-75 flex flex-col"
            onClick={onClick}
        >

            <div className="speech-bubble--content w-[95%]">
                <p>{quote}</p>
                <span className="username mt-3">{speaker}, S{season}E{episode}</span>
            </div>

            <div className="speech-bubble--icons flex gap-4 text-[#e6e9ef] justify-center items-center mt-2">
                <FaRegCopy size={18} className="speech-bubble--icon" />
                <VoteButtons quote_id={id} />
                <FavoriteButton quote_id={id} />
                <FaShare size={18} className="speech-bubble--icon" />
            </div>
        </div>
    );
} */

export default function SearchResults({
    searchResults,
    handleSetBackroll
}: {
    searchResults: CardProps[];
    handleSetBackroll: (quote: CardProps) => void;
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
                <p className="text-sm text-gray-600 font-medium">
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
            className="search-result-item cursor-pointer
           transition-all duration-150 ease-out"
        >
            <p className="text-gray-800 font-medium leading-relaxed transition-colors duration-150 pl-5">
                {truncatedQuote}
            </p>
        </div >
    );
}