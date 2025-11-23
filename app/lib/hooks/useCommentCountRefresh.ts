// hooks/useCommentCountRefetch.ts
import { trpc } from '../trpc';

export function useCommentCountRefetch() {
    const utils = trpc.useUtils();

    const refetchCommentCount = async (quoteId: string) => {
        const newCount = await utils.comments.refetchCommentCount.fetch({ quoteId });

        // Update cache
        utils.comments.getCommentCount.setData({ quoteId }, newCount);

        // Dispatch event for other components
        const event = new CustomEvent('commentAdded', {
            detail: {
                newCommentCount: newCount,
                quoteId
            }
        });
        window.dispatchEvent(event);

        return newCount;
    };

    return refetchCommentCount;
}