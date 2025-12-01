import { FavoriteButton, ShareButton, CopyButton } from './ActionButtons';
import { BackrollActionsProps } from '../../../lib/definitions';

export function ShareCopyFavorite({
    quoteId,
    quoteText,
    onRemoveFavorite
}: ShareCopyFavoriteProps) {
    return (
        <div className="flex flex-col items-center justify-center h-full m-auto gap-2 mr-1">
            <ShareButton />
            <CopyButton textToCopy={quoteText} />
            <FavoriteButton
                onRemoveFavorite={onRemoveFavorite}
                quoteId={quoteId}
            />
        </div>
    );
}

interface ShareCopyFavoriteProps {
    quoteId: string;
    quoteText: string;
    onRemoveFavorite?: () => void;
}

export default function BackrollSideActions({
    quoteId,
    quoteText,
    onRemoveFavorite
}: BackrollActionsProps) {
    return (
        <ShareCopyFavorite
            quoteId={quoteId}
            quoteText={quoteText}
            onRemoveFavorite={onRemoveFavorite}
        />
    );
}