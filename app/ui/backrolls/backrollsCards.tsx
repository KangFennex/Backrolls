
import { useState, useEffect } from 'react';
import { useBackrollsStore } from '../../store/backrollsStore';
import { getQuoteById } from '../../lib/data';
import { styled } from '@mui/material/styles';
import CardMedia from '@mui/material/CardMedia';
import CardActions from '@mui/material/CardActions';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Collapse from '@mui/material/Collapse';

import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';

interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme }) => ({
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
    variants: [
        {
            props: ({ expand }) => !expand,
            style: {
                transform: 'rotate(0deg)',
            },
        },
        {
            props: ({ expand }) => !!expand,
            style: {
                transform: 'rotate(180deg)',
            },
        },
    ],
}));

export default function BackrollCard() {
    const backrollId = useBackrollsStore((state) => state.backrollId);
    const [quote, setQuote] = useState([]);
    const [expanded, setExpanded] = useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    // Fetch the quote data based on the backrollId
    useEffect(() => {
        if (backrollId) {
            const fetchQuote = async () => {
                const quote = await getQuoteById(backrollId);
                if (quote) {
                    console.log('Fetched quote:', quote);
                    setQuote(quote);
                } else {
                    console.error('No quote found for backrollId:', backrollId);
                }
            };
            fetchQuote();
        }
    }, [backrollId]);

    return (
        <div className="backroll-card">
            <Box className="backroll-card--content">
                <Card csx={{ minWidth: 275 }}>
                    <CardHeader
                        title={`${quote.speaker}, S${quote.season}E${quote.episode}`}
                        action={
                            <IconButton aria-label="settings">
                                <MoreVertIcon />
                            </IconButton>
                        }
                    />
                    <CardMedia alt="" />
                    <CardContent>
                        {backrollId ? (
                            <>
                                <p>{quote.quote_text}</p>
                                <span>{quote.speaker}</span>
                            </>
                        ) : (
                            <p className="text-blue-800">No Backroll selected</p>
                        )}
                    </CardContent>

                    <CardActions disableSpacing>
                        <IconButton aria-label="add to favorites">
                            <FavoriteIcon />
                        </IconButton>
                        <IconButton aria-label="share">
                            <ShareIcon />
                        </IconButton>
                        <ExpandMore
                            expand={expanded}
                            onClick={handleExpandClick}
                            aria-expanded={expanded}
                            aria-label="show more"
                        >
                            <ExpandMoreIcon />
                        </ExpandMore>
                    </CardActions>

                </Card>
            </Box>
        </div>
    )
}