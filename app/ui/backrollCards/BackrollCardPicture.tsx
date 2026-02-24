import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import type { Quote } from '../../lib/definitions';
import { getSpeakerBackgroundImageValue } from '../../lib/contestantImages';
import '@/app/scss/backrolls/BackrollCardPicture.scss';
import { FiExternalLink } from "react-icons/fi";
import { useState, useMemo } from 'react';

// Generate a random color class based on quote ID for the blur effect
const getColorClass = (quoteId: string | number | undefined): string => {
    if (!quoteId) return 'color-1';
    const colorClasses = ['color-1', 'color-2', 'color-3', 'color-4', 'color-5'];

    if (typeof quoteId === 'string') {
        // Take just 4 characters from the UUID (positions 0, 8, 16, 24)
        const char1 = quoteId.charCodeAt(0) || 0;
        const char2 = quoteId.charCodeAt(8) || 0;  // After first dash
        const char3 = quoteId.charCodeAt(16) || 0; // After second dash
        const char4 = quoteId.charCodeAt(24) || 0; // After third dash

        const numericValue = char1 + char2 + char3 + char4;
        return colorClasses[numericValue % colorClasses.length];
    }

    return colorClasses[quoteId % colorClasses.length];
};

type BackrollCardPicture2Props = {
    quote: Quote;
    onClick: () => void;
    isFullScreen?: boolean;
};

export function BackrollCardPicture({
    quote,
    onClick,
    isFullScreen,
}: BackrollCardPicture2Props) {
    const speakerImageBackground = getSpeakerBackgroundImageValue(quote.speaker);
    const quoteLength = quote.quote_text.trim().length;
    const quoteMaxLength = 100;
    const isQuoteLong = quoteLength > quoteMaxLength;

    const handleQuoteLong = (quote: Quote) => {
        return quote.quote_text.length > quoteMaxLength
            ? quote.quote_text.slice(0, quoteMaxLength) + '...'
            : quote.quote_text;
    }

    const [isCardRevealed, setIsCardRevealed] = useState(false);

    // Generate consistent random color class for this quote
    const colorClass = useMemo(() => {
        const className = getColorClass(quote.id);
        return className;
    }, [quote.id]);

    const handleToggleCard = () => {
        setIsCardRevealed(!isCardRevealed);
    };

    const handleLinkClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onClick();
    };

    return (
        <div className={`backroll-picture-card ${isFullScreen ? ' fullscreen' : ''}`}>
            <Box>
                <Card className="backroll-picture-card__root" sx={{ backgroundColor: 'transparent' }} onClick={handleToggleCard}>

                    {/* Quote Content */}
                    <CardContent
                        className={`backroll-picture-card__overlay ${colorClass} ${isCardRevealed ? ' revealed' : ''}`}
                    >
                        <p className="backrollCard-font backroll-picture-card__quote">
                            {isQuoteLong ? handleQuoteLong(quote) : quote.quote_text}
                        </p>
                        <Box className="backroll-picture-card__speaker">
                            <h4 className="mini-quote-card__speaker-text mini-quote-card-font backrollCard-font text-md pink-fill">
                                - {quote.speaker}
                            </h4>
                            <div>
                                <FiExternalLink size={20} color="#FF61A6"
                                    onClick={handleLinkClick}
                                    className="backroll-picture-card__link" />
                            </div>
                        </Box>
                    </CardContent>

                    {/* Contestant Image */}
                    <Box
                        className={`backroll-picture-card__image ${colorClass}${isCardRevealed ? ' revealed' : ''}`}
                        style={{
                            backgroundImage: speakerImageBackground,
                        }}
                    />
                </Card>
            </Box>
        </div>
    );
}