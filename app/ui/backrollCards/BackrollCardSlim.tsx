import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import type { Quote } from '../../lib/definitions';
import { getSpeakerImageWithFallback } from '../../lib/utils';
import { CardActions } from '@mui/material';
import { FavoriteButton, VoteButtons, ShareButton, CopyButton, CommentButton } from './components/ActionButtons';
import '@/app/scss/backrolls/BackrollCardSlim.scss';

interface ShareCopyFavoriteProps {
    quoteId: string;
    quoteText: string;
}

export function ShareCopyFavorite({
    quoteId,
    quoteText,
}: ShareCopyFavoriteProps) {
    return (
        <div className="flex items-center justify-between gap-2 py-1 px-3">
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
    const quoteMaxLength = 120;
    const isQuoteLong = quoteLength > quoteMaxLength;

    const handleQuoteLong = (quote: Quote) => {
        return quote.quote_text.length > quoteMaxLength
            ? quote.quote_text.slice(0, quoteMaxLength) + '...'
            : quote.quote_text;
    }

    const getDynamicFontSize = (length: number) => {
        if (length <= 15) return '3rem';
        if (length <= 20) return '2.9rem';
        if (length <= 30) return '2.8rem';
        if (length <= 50) return '2rem';
        if (length <= 80) return '1.8rem';
        if (length <= 100) return '1.9rem';
        return '1.5rem';
    };

    return (
        <div className="mini-quote-card" onClick={onClick}>
            <Box className="mini-quote-card--content" sx={{ boxShadow: 'none' }}>
                <Card
                    className="bcs-card"
                    sx={{
                        backgroundColor: 'transparent',
                        padding: '0',
                        boxShadow: 'none',
                    }}
                >
                    {/* Quote Content */}
                    <CardContent sx={{ padding: '0', backgroundColor: 'transparent', boxShadow: 'none' }} className="bcs-content">
                        <div className={`bcs-quote-wrapper flex flex-col ${quoteLength > 80 ? 'bcs-quote-wrapper--long' : ''}`}>
                            <p
                                className="backrollCard-font bcs-quote"
                                style={{ fontSize: getDynamicFontSize(quoteLength) }}
                            >
                                {isQuoteLong ? handleQuoteLong(quote) : quote.quote_text}
                            </p>
                            <span className="text-[0.8rem] pink-fill bcs-speaker">
                                — {quote.speaker}
                            </span>
                        </div>
                    </CardContent>

                    {/* Contestant Image */}
                    <Box
                        className="bcs-image"
                        sx={{ backgroundImage: `url(${speakerImage})`, boxShadow: 'none' }}
                    />

                    {/* Actions */}
                    <CardActions
                        sx={{
                            color: '#FFFFF0',
                            backgroundColor: 'transparent',
                            boxShadow: 'none', padding: '0',
                        }}
                        className="bcs-actions"
                    >
                        <div className="bcs-actions-container">
                            <div className="bcs-actions-item">
                                <VoteButtons
                                    quoteId={quote.id}
                                    initialVoteCount={quote.vote_count}
                                />
                            </div>
                            <div className="bcs-actions-item">
                                <CommentButton onClick={onClick} quoteId={quote.id} />
                            </div>
                            <div className="bcs-actions-item">
                                <ShareCopyFavorite
                                    quoteId={quote.id}
                                    quoteText={quote.quote_text}
                                />
                            </div>
                        </div>
                    </CardActions>
                </Card>
            </Box>
        </div >
    );
}