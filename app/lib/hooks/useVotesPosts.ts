import { trpc } from '../trpc';
import { useSession } from 'next-auth/react';
import type { Session } from 'next-auth';

export function useVotesPosts() {
    const { data: session } = useSession();
    const userId = (session as Session | null)?.user?.id;

    return trpc.postVotes.getPostUserVotes.useQuery(undefined, {
        enabled: !!userId,
    });
}

export function useTogglePostVote() {
    const utils = trpc.useUtils();

    return trpc.postVotes.togglePostVote.useMutation({
        // Cancel outgoing refetches
        onMutate: async (variables) => {
            // Cancel outgoing refetches
            await utils.postVotes.getPostUserVotes.cancel();

            // Snapshot previous state for rollback
            const previousVotes = utils.postVotes.getPostUserVotes.getData();

            // Optimistically update user's vote status
            utils.postVotes.getPostUserVotes.setData(undefined, (old) => {
                const votes = old?.votes || [];
                const existingVoteIndex = votes.findIndex(v => v.post_id === variables.post_id);

                let newVotes;
                if (existingVoteIndex >= 0) {
                    const existingVote = votes[existingVoteIndex];
                    if (existingVote.vote_type === variables.vote_type) {
                        // Remove vote
                        newVotes = votes.filter(v => v.post_id !== variables.post_id);
                    } else {
                        // Switch vote
                        newVotes = [
                            ...votes.slice(0, existingVoteIndex),
                            { post_id: variables.post_id, vote_type: variables.vote_type },
                            ...votes.slice(existingVoteIndex + 1)
                        ];
                    }
                } else {
                    // Add new vote
                    newVotes = [...votes, { post_id: variables.post_id, vote_type: variables.vote_type }];
                }

                return { votes: newVotes };
            });

            // Return context for rollback
            return { previousVotes };
        },

        onError: (err, variables, context) => {
            console.error('Failed to toggle post vote:', err);
            // Rollback on error
            if (context?.previousVotes) {
                utils.postVotes.getPostUserVotes.setData(undefined, context.previousVotes);
            }
        },

        onSettled: (data, error, variables) => {
            // Sync user's vote status with server
            utils.postVotes.getPostUserVotes.invalidate();
            utils.post.getPost.invalidate({ post_id: variables.post_id });
        },
    });
}