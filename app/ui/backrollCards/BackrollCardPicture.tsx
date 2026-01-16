import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import type { Quote } from '../../lib/definitions';
import { getSpeakerImageWithFallback } from '../../lib/utils';
import '@/app/scss/backrolls/BackrollCardPicture2.scss';
import { FiExternalLink } from "react-icons/fi";
import { useState } from 'react';

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
    const speakerImage = getSpeakerImageWithFallback(quote.speaker);

    const [isCardRevealed, setIsCardRevealed] = useState(false);

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
                    <CardContent className={`backroll-picture-card__overlay${isCardRevealed ? ' revealed' : ''}`}>
                        <p className="backrollCard-font backroll-picture-card__quote">
                            {quote.quote_text}
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
                    <Box className={`backroll-picture-card__image${isCardRevealed ? ' revealed' : ''}`} sx={{ backgroundImage: `url(${speakerImage})` }} />
                </Card>
            </Box>
        </div>
    );
}