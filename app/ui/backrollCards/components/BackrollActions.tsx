import { styled } from '@mui/material/styles';
import CardActions from '@mui/material/CardActions';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { FavoriteButton, VoteButtons, ShareButton, CopyButton, CommentButton } from './ActionButtons';
import { BackrollActionsProps } from '../../../lib/definitions';

interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
}

interface ShareCopyFavoriteProps {
    quoteId: string;
    quoteText: string;
    onRemoveFavorite?: (quote_id: string) => void;
}

export function ShareCopyFavorite({
    quoteId,
    quoteText,
    onRemoveFavorite
}: ShareCopyFavoriteProps) {
    return (
        <div className="flex items-center justify-between gap-2 mr-1">
            <ShareButton />
            <CopyButton textToCopy={quoteText} />
            <FavoriteButton
                onRemoveFavorite={onRemoveFavorite}
                quoteId={quoteId}
            />
        </div>
    );
}

const ExpandMore = styled((props: ExpandMoreProps) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme }) => ({
    marginLeft: 'auto',
    marginRight: theme.spacing(1),
    padding: theme.spacing(0.2),
    transition: theme.transitions.create(['transform', 'background-color'], {
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

export default function BackrollActions({
    quoteId,
    quoteText,
    currentVoteCount,
    isCompact,
    expanded,
    onExpandClick,
    onRemoveFavorite,
    onClick,
}: BackrollActionsProps) {

    return (
        <CardActions disableSpacing sx={{
            justifyContent: 'space-between',
            borderTop: 'none',
            marginTop: 'auto', // Push to bottom
            width: '100%',
            padding: 0
        }}>
            <div className="flex items-center justify-baseline w-full gap-2">
                <div>
                    <VoteButtons
                        quoteId={quoteId}
                        initialVoteCount={currentVoteCount}
                    />
                </div>
                <div className="">
                    <CommentButton onClick={onClick} quoteId={quoteId} />
                </div>
                <div>
                    <ShareCopyFavorite
                        quoteId={quoteId}
                        quoteText={quoteText}
                        onRemoveFavorite={onRemoveFavorite}
                    />
                </div>
            </div>
            {!isCompact && (
                <ExpandMore
                    expand={expanded}
                    onClick={onExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
                    sx={{
                        color: '#FFFFF0 !important',
                        '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.08)',
                        },
                        '& .MuiSvgIcon-root': {
                            color: '#FFFFF0 !important'
                        }
                    }}
                >
                    <ExpandMoreIcon />
                </ExpandMore>
            )}
        </CardActions>
    );
}