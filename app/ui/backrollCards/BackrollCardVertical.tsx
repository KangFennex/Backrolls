import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import type { Quote } from '../../lib/definitions';
import { getSpeakerImageWithFallback } from '../../lib/utils';
import './BackrollCardVertical.scss';

export function BackrollCardVertical({
    quote,
    onClick,
}: {
    quote: Quote;
    onClick: () => void;
}) {
    const speakerImage = getSpeakerImageWithFallback(quote.speaker);

    return (
        <div className="backroll-vertical-card" onClick={onClick}>
            <Box>
                <Card className="backroll-vertical-card__root" sx={{ backgroundColor: 'transparent' }}>

                    {/* Contestant Image - Full Width Top */}
                    <Box className="backroll-vertical-card__image" sx={{ backgroundImage: `url(${speakerImage})` }} />

                    {/* Quote Content - Bottom positioned */}
                    <CardContent className="backroll-vertical-card__content">
                        <p className="backrollCard-font backroll-vertical-card__quote">
                            {quote.quote_text}
                        </p>
                        <Box className="backroll-vertical-card__speaker">
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
