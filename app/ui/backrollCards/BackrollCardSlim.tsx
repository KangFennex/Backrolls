import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import type { Quote } from '../../lib/definitions';
import { getSpeakerImageWithFallback } from '../../lib/utils';
import { CardActions } from '@mui/material';
import { FavoriteButton, VoteButtons, ShareButton, CopyButton, CommentButton } from './components/ActionButtons';
import './BackrollCardSlim.scss';

interface ShareCopyFavoriteProps {
    quoteId: string;
    quoteText: string;
}

export function ShareCopyFavorite({
    quoteId,
    quoteText,
}: ShareCopyFavoriteProps) {
    return (
        <div className="flex items-center justify-between gap-2 mr-1">
            <ShareButton />
            <CopyButton textToCopy={quoteText} />
            <FavoriteButton
                quoteId={quoteId}
            />
        </div>
    );
}

export function BackrollCardSlim({
    quote,
    onClick,
}: {
    quote: Quote;
    onClick: () => void;
}) {
    const speakerImage = getSpeakerImageWithFallback(quote.speaker);
    const quoteLength = quote.quote_text.trim().length;

    const getDynamicFontSize = (length: number) => {
        if (length <= 15) return '2.8rem';
        if (length <= 20) return '2.4rem';
        if (length <= 30) return '1.8rem';
        if (length <= 50) return '1.5rem';
        if (length <= 80) return '1.3rem';
        return '1.2rem';
    };

    return (
        <div className="mini-quote-card" onClick={onClick}>
            <Box className="mini-quote-card--content">
                <Card
                    className="bcs-card"
                    sx={{
                        backgroundColor: 'transparent',
                        padding: '0',
                    }}
                >
                    {/* Contestant Image - Left Side */}
                    <Box
                        className="bcs-image"
                        sx={{ backgroundImage: `url(${speakerImage})` }}
                    />

                    <Card
                        className="bcs-inner"
                        sx={{ backgroundColor: 'transparent', padding: '0' }}
                    >
                        {/* Quote Content - Right Side */}
                        <CardContent sx={{ padding: '0' }} className="bcs-content">
                            <div className={`bcs-quote-wrapper ${quoteLength > 80 ? 'bcs-quote-wrapper--long' : ''}`}>
                                <p
                                    className="mini-quote-card__quote-text mini-quote-card-font backrollCard-font bcs-quote"
                                    style={{ fontSize: getDynamicFontSize(quoteLength) }}
                                >
                                    {quote.quote_text}
                                </p>
                            </div>
                            <span className="text-[0.8rem] pink-fill bcs-speaker">
                                — {quote.speaker}
                            </span>
                        </CardContent>
                        <CardActions
                            sx={{
                                color: '#FFFFF0',
                            }}
                        >
                            <div className="bcs-actions-container">
                                <div>
                                    <VoteButtons
                                        quoteId={quote.id}
                                        initialVoteCount={quote.vote_count}
                                    />
                                </div>
                                <div>
                                    <CommentButton onClick={onClick} quoteId={quote.id} />
                                </div>
                                <div>
                                    <ShareCopyFavorite
                                        quoteId={quote.id}
                                        quoteText={quote.quote_text}
                                    />
                                </div>
                            </div>
                        </CardActions>
                    </Card>
                </Card>
            </Box>
        </div>
    );
}