import { useState } from 'react';
import { Quote, QuoteCardProps } from '../../lib/definitions';
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


function Backroll({
    quote_text,
    speaker,
    maxLength = 60,
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
            <p>{truncatedText}</p>
            <span>{speaker}</span>
        </div>
    )
}

export function QuoteCard({
    quote,
    variant = 'full',
    onRemoveFavorite,
    onClick,
    index = 0,
}: QuoteCardProps
) {
    const [expanded, setExpanded] = useState(true);
    const isCompact = variant === 'compact';

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    return (
        <div className="backroll-card"
            onClick={onClick}
            style={{ cursor: onClick ? 'pointer' : 'default' }}
        >
            <Box className="backroll-card--content flex flex-col items-center justify-center">
                <Card sx={{
                    width: isCompact ? 240 : 300,
                    maxHeight: isCompact ? 200 : 400,
                    backgroundColor: getBackrollCardBackground(index),
                    color: 'var(--rich-charcoal)',
                    border: '1px solid var(--rich-charcoal)',
                    borderRadius: '8px',
                    boxShadow: `
        0 4px 8px color-mix(in srgb, var(--rich-charcoal) 15%, transparent),
        0 2px 4px color-mix(in srgb, var(--rich-charcoal) 10%, transparent)
    `,
                    transition: 'box-shadow 0.3s ease',
                    '&:hover': {
                        boxShadow: `
            0 6px 12px color-mix(in srgb, var(--rich-charcoal) 20%, transparent),
            0 4px 8px color-mix(in srgb, var(--rich-charcoal) 15%, transparent)
        `
                    }
                }}>
                    <CardHeader
                        title={
                            <div>
                                <Breadcrumb
                                    series={quote.series}
                                    season={quote.season}
                                    episode={quote.episode}
                                />
                            </div>
                        }
                        sx={{
                            padding: '5px', '& .MuiCardHeader-avatar': {
                                marginRight: '10px'
                            }
                        }}
                        action={
                            <IconButton aria-label="settings">
                                <MoreVertIcon />
                            </IconButton>
                        }
                        avatar={
                            <Avatar aria-label="avatar" sx={{ width: 30, height: 30 }}>
                                <Image src="/media/rupaul.jpg" alt="RuPaul" width={40} height={40} />
                            </Avatar>
                        }
                    />
                    <CardMedia component="div" />
                    <CardContent sx={{ display: 'flex', width: '100%', marginTop: isCompact ? '5px' : '5px', gap: isCompact ? 1 : 2, padding: '8px', paddingTop: 0 }}>
                        <Backroll
                            quote_text={quote.quote_text}
                            speaker={quote.speaker}
                            maxLength={isCompact ? 60 : 150}
                        />
                    </CardContent>

                    <CardActions disableSpacing sx={{ '&.MuiCardActions-root': { padding: '0' } }}>
                        <div className="flex items-center space-between w-full px-1">
                            <VoteButtons
                                quote_id={String(quote.id)}
                                currentVoteCount={quote.vote_count}
                            />
                            <CardActions disableSpacing sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                marginLeft: 'auto',
                                gap: isCompact ? 1 : 2
                            }}>
                                <CopyButton textToCopy={quote.quote_text} />
                                <FavoriteButton
                                    quote_id={String(quote.id)}
                                    onRemoveFavorite={onRemoveFavorite}
                                />
                                <ShareButton />
                            </CardActions>
                        </div>
                        {!isCompact && (
                            <ExpandMore
                                expand={expanded}
                                onClick={handleExpandClick}
                                aria-expanded={expanded}
                                aria-label="show more"
                                sx={{ mr: '0.6rem' }}
                            >
                                <ExpandMoreIcon />
                            </ExpandMore>
                        )}
                    </CardActions>

                    {!isCompact && (
                        <Collapse in={expanded} timeout="auto" unmountOnExit>
                            <CardContent className='flex flex-col gap-2'>
                                <h4>{`Speaker: ${quote.speaker}`}</h4>
                                <h4>{`Series: ${quote.series}`}</h4>
                                <h4>{`Season: ${quote.season}`}</h4>
                                <h4>{`Episode: ${quote.episode}`}</h4>
                                <h4>{`Timestamp: ${quote.timestamp}`}</h4>
                                <h4>{`Context: ${quote.context}`}</h4>
                                <h4>{`Vote Count: ${quote.vote_count}`}</h4>
                                <h4>{`Share Count: ${quote.share_count}`}</h4>
                            </CardContent>
                        </Collapse>
                    )}
                </Card>
            </Box>
        </div >
    );
}

