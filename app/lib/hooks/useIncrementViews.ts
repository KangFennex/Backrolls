'use client';

import { trpc } from '../trpc';

export function useIncrementViews() {
    const utils = trpc.useUtils();

    return trpc.quotes.incrementViews.useMutation({
        onSuccess: (data, variables) => {
            // Optimistically update the cached quote data with incremented view count
            utils.quotes.getById.setData(
                { id: variables.quoteId },
                (old) => {
                    if (!old) return old;
                    return {
                        ...old,
                        view_count: (old.view_count || 0) + 1,
                    };
                }
            );

            // Also invalidate to ensure data stays fresh (background refetch)
            utils.quotes.getById.invalidate({ id: variables.quoteId });
        },
    });
}
