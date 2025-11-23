'use client';

import { useEffect } from 'react';
import { trpc } from '../trpc';

export function useCommentButton(quoteId: string) {
    const utils = trpc.useUtils();

    const query = trpc.comments.getCommentCount.useQuery(
        { quoteId },
        {
            enabled: !!quoteId
        }
    );

    // Listen for new comments and update cache
    useEffect(() => {
        const handleNewComment = (event: Event) => {
            const customEvent = event as CustomEvent;
            const { newCommentCount, quoteId: eventQuoteId } = customEvent.detail;

            if (eventQuoteId === quoteId) {
                utils.comments.getCommentCount.setData({ quoteId }, newCommentCount);
            }
        };

        window.addEventListener('commentAdded', handleNewComment);
        return () => window.removeEventListener('commentAdded', handleNewComment);
    }, [quoteId, utils]);

    return query;
}