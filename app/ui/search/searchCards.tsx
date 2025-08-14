'use client';

import "./searchCards.scss";
import { FaShare } from "react-icons/fa";
import { IoMdShareAlt } from "react-icons/io";
import { AiFillLike } from "react-icons/ai";
import { MdFavoriteBorder, MdFavorite } from "react-icons/md";

export type Quote = {
    id: string | number;
    quote_text: string;
    speaker: string;
    season: number;
    episode: number;
};

type CardWrapperProps = {
    searchResults: Quote[];
};

type CardProps = {
    quote: string;
    speaker: string;
    season: number;
    episode: number;
};

export default function CardWrapper({ searchResults }: CardWrapperProps) {
    return (
        <div className="cards-wrapper w-full h-full pt-2">
            {searchResults.length > 0 && (
                <div className="search-results flex flex-col pt-4 gap-3 items-center">
                    {searchResults.map((quote) => (
                        <Card
                            key={quote.id}
                            quote={quote.quote_text}
                            speaker={quote.speaker}
                            season={quote.season}
                            episode={quote.episode}
                        />
                    ))}
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
}: CardProps
) {
    return (
        <div className="speech-bubble relative w-[80%] active:scale-95 transition-transform duration-75 grid grid-cols-[90%_10%]">

            <div className="speech-bubble--content">
                <p>{quote}</p>
                <span className="username">{speaker}, S{season}E{episode}</span>
            </div>

            <div className="speech-bubble--icons flex flex-col gap-4 text-[#e6e9ef] justify-end items-center">
                <FaShare size={20} className="speech-bubble--icon" />
                <AiFillLike size={20} className="speech-bubble--icon" />
                <MdFavoriteBorder size={20} className="speech-bubble--icon" />
            </div>

        </div>
    );
}