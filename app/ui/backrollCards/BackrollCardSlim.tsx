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

    return (
        <div className="mini-quote-card" onClick={onClick}>
            <Box className="mini-quote-card--content">
                <Card
                    className="bcs-card"
                    sx={{
                        backgroundColor: 'transparent',

                    }}
                >
                    {/* Contestant Image - Left Side */}
                    <Box
                        className="bcs-image"
                        sx={{ backgroundImage: `url(${speakerImage})` }}
                    />

                    <Card
                        className="bcs-inner"
                        sx={{ backgroundColor: 'transparent' }}
                    >
                        {/* Quote Content - Right Side */}
                        <CardContent className="bcs-content">
                            <p className="mini-quote-card__quote-text mini-quote-card-font backrollCard-font text-xl bcs-quote">
                                {quote.quote_text}
                            </p>
                            <span className="text-[0.8rem] ml-auto pink-fill bcs-speaker">
                                — {quote.speaker}
                            </span>
                            <div className="flex justify-between items-center bcs-actions">
                            </div>
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