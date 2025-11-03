import { useState } from 'react';
import { Quote } from '../../lib/definitions';
import { styled } from '@mui/material/styles';
import Image from 'next/image';
import Avatar from '@mui/material/Avatar';
import CardMedia from '@mui/material/CardMedia';
import CardActions from '@mui/material/CardActions';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Collapse from '@mui/material/Collapse';
import { FavoriteButton, VoteButtons, ShareButton, CopyButton } from '../buttons/buttons';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Breadcrumb from "../breadcrumbs";
import { getBackrollCardBackground } from '../../lib/hooks';
import './backrolls.scss';

interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

interface QuoteCardProps {
    quote: Quote;
    variant?: 'full' | 'compact';
    onRemoveFavorite?: (quote_id: string) => void;
    onDoubleClick?: () => void;
    index?: number;
}

function Backroll({
    quote_text,
    speaker,
    maxLength = 280,
}: {
    quote_text: string;
    speaker: string;
    maxLength?: number;
}) {
    const truncatedText = quote_text.length > maxLength
        ? quote_text.substring(0, maxLength) + '...'
        : quote_text;

    return (
        <div className="backroll">
            <p className="quote-text">
                {truncatedText}
            </p>
            <span className="quote-speaker">
                {speaker}
            </span>
        </div>
    )
}

export function BackrollCard({
    quote,
    variant = 'full',
    onRemoveFavorite,
    onDoubleClick,
    index = 0,
}: QuoteCardProps
) {
    const [expanded, setExpanded] = useState(false); // Start collapsed like Reddit
    const isCompact = variant === 'compact';

    // Get subtle background color
    const backgroundColor = getBackrollCardBackground(index);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    return (
        <div className="backroll-card"
            onDoubleClick={onDoubleClick}
            style={{ cursor: onDoubleClick ? 'pointer' : 'default', width: '100%' }}
        >
            <Box className="backroll-card--content">
                <Card sx={{
                    width: '100%',
                    height: 'auto',
                    backgroundColor: `${backgroundColor}10`,
                    color: '#FFFFF0',
                    borderTop: '1px solid rgba(255, 255, 240, 0.1)',
                    borderBottom: '1px solid rgba(255, 255, 240, 0.1)',
                    borderLeft: 'none',
                    borderRight: 'none',
                    borderRadius: '16px',
                    boxShadow: 'none',
                    transition: 'background-color 0.2s ease-in-out',
                    '&:hover': {
                        backgroundColor: `${backgroundColor}20`,
                    }
                }}>
                    <CardHeader
                        title={
                            <div className="text-xs text-gray-400">
                                <Breadcrumb
                                    series={quote.series}
                                    season={quote.season}
                                    episode={quote.episode}
                                />
                            </div>
                        }
                        sx={{
                            padding: '12px 16px 0px 16px',
                            '& .MuiCardHeader-avatar': {
                                marginRight: '12px'
                            },
                            '& .MuiCardHeader-content': {
                                overflow: 'hidden'
                            }
                        }}
                        action={
                            <IconButton aria-label="settings" size="small" sx={{ color: 'gray' }}>
                                <MoreVertIcon fontSize="small" />
                            </IconButton>
                        }
                        avatar={
                            <Avatar aria-label="avatar" sx={{ width: 30, height: 30 }}>
                                <Image src="/media/rupaul.jpg" alt="RuPaul" width={30} height={30} />
                            </Avatar>
                        }
                    />
                    <CardMedia component="div" />
                    <CardContent className="backroll-card-content">
                        <Backroll
                            quote_text={quote.quote_text}
                            speaker={quote.speaker}
                            maxLength={isCompact ? 120 : 300}
                        />
                    </CardContent>

                    <CardActions disableSpacing sx={{
                        padding: '8px 16px 12px 16px',
                        justifyContent: 'space-between',
                        borderTop: 'none'
                    }}>
                        <div className="flex items-center justify-between gap-4">
                            <VoteButtons
                                quote_id={String(quote.id)}
                                currentVoteCount={quote.vote_count}
                            />
                            <div className="flex items-center gap-2">
                                <CopyButton textToCopy={quote.quote_text} />
                                <FavoriteButton
                                    quote_id={String(quote.id)}
                                    onRemoveFavorite={onRemoveFavorite}
                                />
                                <ShareButton />
                            </div>
                        </div>
                        {!isCompact && (
                            <ExpandMore
                                expand={expanded}
                                onClick={handleExpandClick}
                                aria-expanded={expanded}
                                aria-label="show more"
                                sx={{
                                    color: 'gray',
                                    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.08)' }
                                }}
                            >
                                <ExpandMoreIcon />
                            </ExpandMore>
                        )}
                    </CardActions>
                    <Collapse in={expanded} timeout="auto" unmountOnExit>
                        <CardContent sx={{
                            padding: '0 16px 16px 16px',
                            borderTop: '1px solid rgba(255, 255, 240, 0.1)',
                            backgroundColor: 'rgba(255, 255, 255, 0.02)'
                        }}>
                            <div className='flex flex-col gap-3 pt-4 text-sm text-gray-300'>
                                <div><span className="text-gray-400">Speaker:</span> {quote.speaker}</div>
                                <div><span className="text-gray-400">Series:</span> {quote.series}</div>
                                <div><span className="text-gray-400">Season:</span> {quote.season}</div>
                                <div><span className="text-gray-400">Episode:</span> {quote.episode}</div>
                                <div><span className="text-gray-400">Timestamp:</span> {quote.timestamp}</div>
                                <div><span className="text-gray-400">Context:</span> {quote.context}</div>
                                <div className="flex gap-4 pt-2 border-t border-gray-700">
                                    <span><span className="text-gray-400">Votes:</span> {quote.vote_count}</span>
                                    <span><span className="text-gray-400">Shares:</span> {quote.share_count}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Collapse>
                </Card>
            </Box>
        </div >
    );
}

