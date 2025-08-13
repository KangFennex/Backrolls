'use client';

import "./searchCards.scss";

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
                <div className="search-results flex flex-col gap-8">
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
        <div className="speech-bubble">
            <p>{quote}</p>
            <span className="username">{speaker}, S{season}E{episode}</span>
        </div>
    );
}