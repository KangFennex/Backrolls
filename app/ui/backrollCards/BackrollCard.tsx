import { useState } from 'react';
import { QuoteCardProps } from '../../lib/definitions';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import { selectBackgroundColor } from '../../lib/utils'
import BackrollHeader from './components/BackrollHeader';
import BackrollContent from './components/BackrollContent';
import BackrollActions from './components/BackrollActions';
import BackrollDetails from './components/BackrollDetails';
import './backrolls.scss';

export function BackrollCard({
    quote,
    variant = 'full',
    onRemoveFavorite,
    onClick,
    mosaic = true
}: QuoteCardProps
) {
    const [expanded, setExpanded] = useState(false);
    const isCompact = variant === 'compact';

    // Get subtle background color
    const backgroundColor = selectBackgroundColor();

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    return (
        <div className={`backroll-card${mosaic ? ' mosaic' : ''}`}
            style={{ cursor: onClick ? 'pointer' : 'default' }}
        >
            <Box className="backroll-card--content">
                <Card sx={{
                    width: '100%',
                    minWidth: '100%',
                    height: '100%',
                    margin: '0 auto',
                    backgroundColor: `${backgroundColor}80`,
                    color: '#FFFFF0',
                    border: '2px solid rgba(255, 255, 240, 0.2)',
                    borderRadius: '16px',
                    boxShadow: 'none',
                    transition: 'background-color 0.2s ease-in-out',
                    display: 'flex',
                    flexDirection: 'column',
                    '&:hover': {
                        backgroundColor: `${backgroundColor}90`,
                        border: `2px solid ${backgroundColor}80`,
                    }
                }}>
                    <BackrollHeader quote={quote} />

                    <CardMedia component="div" />

                    <BackrollContent
                        onClick={onClick}
                        quoteText={quote.quote_text}
                        speaker={quote.speaker}
                    />

                    <BackrollActions
                        quoteId={String(quote.id)}
                        quoteText={quote.quote_text}
                        initialVoteCount={quote.vote_count}
                        isCompact={isCompact}
                        expanded={expanded}
                        onExpandClick={handleExpandClick}
                        onRemoveFavorite={onRemoveFavorite}
                        onClick={onClick}
                    />

                    <BackrollDetails quote={quote} expanded={expanded} />
                </Card>
            </Box>
        </div >
    );
}

