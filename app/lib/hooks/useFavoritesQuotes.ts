'use client';

import { trpc } from '../trpc';
import { useSession } from 'next-auth/react';
import type { Session } from 'next-auth';

export function useFavorites() {
    const { data: session } = useSession();
    const userId = (session as Session | null)?.user?.id;

    return trpc.favorites.getUserFavorites.useQuery(undefined, {
        staleTime: 1000 * 60 * 5, // 5 minutes - don't refetch frequently
        refetchOnWindowFocus: false, // Don't refetch on every tab focus
        enabled: !!userId,
    });
}

export function useToggleFavorite() {
    const utils = trpc.useUtils();

    return trpc.favorites.toggleFavorite.useMutation({
        // Optimistic update
        onMutate: async (variables) => {
            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await utils.favorites.getUserFavorites.cancel();

            // Snapshot the previous value for rollback
            const previousFavorites = utils.favorites.getUserFavorites.getData();

            // Optimistically update the cache
            utils.favorites.getUserFavorites.setData(undefined, (old) => {
                if (!old) return old;

                const quotes = old.quotes || [];
                const favoriteIds = old.favoriteIds || [];
                const isCurrentlyFavorited = favoriteIds.includes(variables.quoteId);

                return {
                    quotes: isCurrentlyFavorited
                        ? quotes.filter(q => q.id !== variables.quoteId) // Remove quote
                        : quotes, // Keep quotes (will refetch to get new one)
                    favoriteIds: isCurrentlyFavorited
                        ? favoriteIds.filter(id => id !== variables.quoteId) // Remove ID
                        : [...favoriteIds, variables.quoteId] // Add ID
                };
            });

            // Return context with the snapshot for potential rollback
            return { previousFavorites };
        },

        // If mutation fails, rollback to previous state
        onError: (err, variables, context) => {
            console.error('Failed to toggle favorite:', err);
            if (context?.previousFavorites) {
                utils.favorites.getUserFavorites.setData(undefined, context.previousFavorites);
            }
        },

        // Always sync with server after mutation (success or error)
        onSettled: () => {
            utils.favorites.getUserFavorites.invalidate();
        },
    });
}
