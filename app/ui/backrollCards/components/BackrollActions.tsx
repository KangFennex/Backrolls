import { styled } from '@mui/material/styles';
import CardActions from '@mui/material/CardActions';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { FavoriteButton, VoteButtons, ShareButton, CopyButton, CommentButton } from '../../buttons/buttons';
import { BackrollActionsProps } from '../../../lib/definitions';

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

export default function BackrollActions({
    quoteId,
    quoteText,
    currentVoteCount,
    isCompact,
    expanded,
    onExpandClick,
    onRemoveFavorite,
}: BackrollActionsProps) {

    return (
        <CardActions disableSpacing sx={{
            padding: '0 5px',
            justifyContent: 'space-between',
            borderTop: 'none'
        }}>
            <div className="flex items-center justify-center gap-10 w-full">
                <div>
                    <VoteButtons
                        quote_id={quoteId}
                        currentVoteCount={currentVoteCount}
                    />
                </div>
                <div>
                    <CommentButton />
                </div>
                <div className="flex items-center gap-4">
                    <ShareButton />
                    <CopyButton textToCopy={quoteText} />
                    <FavoriteButton
                        quote_id={quoteId}
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
                        color: 'gray',
                        '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.08)' }
                    }}
                >
                    <ExpandMoreIcon />
                </ExpandMore>
            )}
        </CardActions>
    );
}