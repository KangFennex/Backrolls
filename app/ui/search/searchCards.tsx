'use client';

import "./searchCards.scss";
import { FaShare } from "react-icons/fa";
import { FaRegCopy } from "react-icons/fa6";
import { AiFillLike } from "react-icons/ai";
import { FiPlusCircle } from "react-icons/fi";
import { MdFavoriteBorder } from "react-icons/md";
import { SearchCardsSkeleton } from "../skeletons";
import { Quote, CardWrapperProps, CardProps } from "../../lib/definitions";
import { useBackrollsStore } from "../../store/backrollsStore";

export default function CardWrapper({ searchResults, clearSearchInput  }: CardWrapperProps) {

    const setBackroll = useBackrollsStore((state) => state.setBackrollId);

    const handleSetBackroll = (id: string) => {
        setBackroll(id);
        console.log("Setting backroll to:", id);
        if (clearSearchInput) {
            clearSearchInput();
        }
    };

    return (
        <div className="card-wrapper w-full h-full pt-2">
            {searchResults.length > 0 && (
                <div className="search-results flex flex-col pt-4 gap-3 items-center overflow-y-auto">
                    {searchResults.map((quote) => (
                        <Card
                            key={quote.id}
                            quote={quote.quote_text}
                            speaker={quote.speaker}
                            season={quote.season}
                            episode={quote.episode}
                            onClick={() => handleSetBackroll(quote.id.toString())}
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
                <AiFillLike size={18} className="speech-bubble--icon" />
                <MdFavoriteBorder size={18} className="speech-bubble--icon" />
                <FaShare size={18} className="speech-bubble--icon" />
            </div>
        </div>
    );
}