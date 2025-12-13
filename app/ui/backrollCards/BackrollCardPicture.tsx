import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import type { Quote } from '../../lib/definitions';
import { getSpeakerImageWithFallback } from '../../lib/utils';
import './BackrollCardPicture.scss';

export function BackrollCardPicture({
    quote,
    onClick,
}: {
    quote: Quote;
    onClick: () => void;
}) {
    const speakerImage = getSpeakerImageWithFallback(quote.speaker);

    return (
        <div className="backroll-picture-card" onClick={onClick}>
            <Box>
                <Card className="backroll-picture-card__root" sx={{ backgroundColor: 'transparent' }}>

                    {/* Contestant Image - Full Width */}
                    <Box className="backroll-picture-card__image" sx={{ backgroundImage: `url(${speakerImage})` }} />

                    {/* Quote Content - Overlay positioned on the right side */}
                    <CardContent className="backroll-picture-card__overlay">
                        <p className="backrollCard-font backroll-picture-card__quote">
                            {quote.quote_text}
                        </p>
                        <Box className="backroll-picture-card__speaker">
                            <h4 className="mini-quote-card__speaker-text mini-quote-card-font backrollCard-font text-md pink-fill">
                                - {quote.speaker}
                            </h4>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </div>
    );
}