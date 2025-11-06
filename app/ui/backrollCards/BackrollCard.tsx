import { useState } from 'react';
import { QuoteCardProps } from '../../lib/definitions';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import { getBackrollCardBackground } from '../../lib/hooks';
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
    index = 0,
}: QuoteCardProps
) {
    const [expanded, setExpanded] = useState(false);
    const isCompact = variant === 'compact';

    // Get subtle background color
    const backgroundColor = getBackrollCardBackground(index);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    return (
        <div className="backroll-card w-[100%]"
            onClick={onClick}
            style={{ cursor: onClick ? 'pointer' : 'default' }}
        >
            <Box className="backroll-card--content">
                <Card sx={{
                    width: '100%',
                    minWidth: '100%',
                    height: 'auto',
                    margin: '0 auto',
                    backgroundColor: `${backgroundColor}90`,
                    color: '#FFFFF0',
                    borderTop: '1px solid rgba(255, 255, 240, 0.1)',
                    borderBottom: '1px solid rgba(255, 255, 240, 0.1)',
                    borderLeft: 'none',
                    borderRight: 'none',
                    borderRadius: '16px',
                    boxShadow: 'none',
                    transition: 'background-color 0.2s ease-in-out',
                    /*'&:hover': {
                        backgroundColor: `${backgroundColor}`,
                    }*/
                }}>
                    <BackrollHeader quote={quote} />

                    <CardMedia component="div" />

                    <BackrollContent
                        quoteText={quote.quote_text}
                        speaker={quote.speaker}
                        maxLength={isCompact ? 120 : 300}
                    />

                    <BackrollActions
                        quoteId={String(quote.id)}
                        quoteText={quote.quote_text}
                        currentVoteCount={quote.vote_count}
                        isCompact={isCompact}
                        expanded={expanded}
                        onExpandClick={handleExpandClick}
                        onRemoveFavorite={onRemoveFavorite}
                    />

                    <BackrollDetails quote={quote} expanded={expanded} />
                </Card>
            </Box>
        </div >
    );
}

