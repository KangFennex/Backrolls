'use client';

import { trpc } from '../trpc';
import { useSession } from 'next-auth/react';
import type { Session } from 'next-auth';

export function useVotes() {
    const { data: session } = useSession();
    const userId = (session as Session | null)?.user?.id;

    return trpc.votes.getUserVotes.useQuery(undefined, {
        enabled: !!userId,
    });
}

export function useToggleVote() {
    const utils = trpc.useUtils();

    return trpc.votes.toggleVote.useMutation({
        onMutate: async (variables) => {
            // Cancel outgoing refetches
            await utils.votes.getUserVotes.cancel();

            // Snapshot previous state for rollback
            const previousVotes = utils.votes.getUserVotes.getData();

            // Optimistically update user's vote status
            utils.votes.getUserVotes.setData(undefined, (old) => {
                const votes = old?.votes || [];
                const existingVoteIndex = votes.findIndex(v => v.quote_id === variables.quoteId);

                let newVotes;
                if (existingVoteIndex >= 0) {
                    const existingVote = votes[existingVoteIndex];
                    if (existingVote.vote_type === variables.voteType) {
                        // Remove vote
                        newVotes = votes.filter(v => v.quote_id !== variables.quoteId);
                    } else {
                        // Switch vote
                        newVotes = [
                            ...votes.slice(0, existingVoteIndex),
                            { quote_id: variables.quoteId, vote_type: variables.voteType },
                            ...votes.slice(existingVoteIndex + 1)
                        ];
                    }
                } else {
                    // Add new vote
                    newVotes = [...votes, { quote_id: variables.quoteId, vote_type: variables.voteType }];
                }

                return { votes: newVotes };
            });

            // Return context for rollback
            return { previousVotes };
        },

        onError: (err, variables, context) => {
            console.error('Failed to toggle vote:', err);
            // Rollback on error
            if (context?.previousVotes) {
                utils.votes.getUserVotes.setData(undefined, context.previousVotes);
            }
        },

        onSuccess: (data) => {
            // Dispatch event so vote count updates across all components
            window.dispatchEvent(new CustomEvent('voteUpdated', {
                detail: {
                    quoteId: data.quoteId,
                    newVoteCount: data.newVoteCount
                }
            }));
        },

        onSettled: () => {
            // Sync with server
            utils.votes.getUserVotes.invalidate();
        },
    });
}
