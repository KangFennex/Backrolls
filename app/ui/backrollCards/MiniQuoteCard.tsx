import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Avatar from '@mui/material/Avatar';
import Image from 'next/image';
import CardContent from '@mui/material/CardContent';
import './backrolls.scss';

export function MiniQuoteCard({
    quote,
    onClick,
}: {
    quote: string;
    onClick: () => void;
}) {
    return (
        <div className="mini-quote-card" onClick={onClick} style={{ cursor: 'pointer' }}>
            <Box className="mini-quote-card--content">
                <Card sx={{
                    width: '100%',
                    maxHeight: '150px',
                    overflowY: 'auto',
                    backgroundColor: 'var(--deep-charcoal)',
                    borderBottom: '1px solid hsl(0, 0%, 80%, 0.8)',
                    padding: '0.1rem',

                    '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.2)',
                    },

                    // Hide scrollbar for Chrome, Safari and Opera
                    '&::-webkit-scrollbar': {
                        display: 'none'
                    },

                    // Hide scrollbar for IE, Edge and Firefox
                    msOverflowStyle: 'none',  // IE and Edge
                    scrollbarWidth: 'none',   // Firefox
                }}>
                    <CardHeader
                        title={
                            <h4 style={{
                                color: 'var(--antique-parchment-dark)',
                                fontSize: '0.7rem',
                                margin: 0,
                                marginLeft: '-10px',
                            }}>
                                {quote.speaker}
                            </h4>
                        }
                        avatar={
                            <Avatar aria-label="avatar" sx={{ width: 20, height: 20 }}>
                                <Image src="/media/rupaul.jpg" alt="RuPaul" width={20} height={20} />
                            </Avatar>
                        }
                        sx={{
                            padding: '0.3rem 0.1rem 0.1rem 0.2rem !important',
                        }}
                    />
                    <CardContent sx={{ padding: '0.5rem !important' }}>
                        <p className="mini-quote-card__quote-text mini-quote-card-font antique-parchment-text-dark text-sm">
                            {quote.quote_text}
                        </p>
                        <div className="flex justify-between items-center">
                            <span className="antique-parchment-text-dark text-[0.6rem] ml-auto pt-1">
                                {`${quote.vote_count} upvotes · ${quote.comment_count} comments`}
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </Box>
        </div>
    );
}