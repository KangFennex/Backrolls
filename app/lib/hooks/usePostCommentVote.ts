'use client';

import { useState, useEffect } from 'react';
import { trpc } from '../trpc';
import { useSession } from 'next-auth/react';

interface UsePostCommentVoteProps {
    commentId: string;
    initialVoteCount: number;
}

export function usePostCommentVote({ commentId, initialVoteCount }: UsePostCommentVoteProps) {
    const [displayVoteCount, setDisplayVoteCount] = useState(initialVoteCount);
    const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);
    const { data: session } = useSession();
    const utils = trpc.useUtils();

    // Fetch user's current vote for this comment
    const { data: userVoteData } = trpc.postComment.getUserCommentVote.useQuery(
        { commentId },
        {
            enabled: !!session && !!commentId,
        }
    );

    // Update userVote when data is fetched
    useEffect(() => {
        if (userVoteData !== undefined) {
            setUserVote(userVoteData?.vote_type || null);
        }
    }, [userVoteData]);

    // Vote mutation with optimistic updates
    const voteMutation = trpc.postComment.voteComment.useMutation({
        onMutate: async (variables) => {
            // Cancel outgoing refetches
            await utils.postComment.getUserCommentVote.cancel({ commentId });

            // Snapshot previous values for rollback
            const previousVote = userVote;
            const previousCount = displayVoteCount;

            // Determine the new state
            let newVote: 'up' | 'down' | null = null;
            let countChange = 0;

            if (previousVote === variables.voteType) {
                // Removing vote
                newVote = null;
                countChange = variables.voteType === 'up' ? -1 : 1;
            } else if (previousVote === null) {
                // Adding vote
                newVote = variables.voteType;
                countChange = variables.voteType === 'up' ? 1 : -1;
            } else {
                // Switching vote
                newVote = variables.voteType;
                countChange = variables.voteType === 'up' ? 2 : -2;
            }

            // Optimistically update state
            setUserVote(newVote);
            setDisplayVoteCount(prev => prev + countChange);

            // Optimistically update cache - use updater function
            utils.postComment.getUserCommentVote.setData({ commentId }, (old) =>
                newVote ? { ...old, vote_type: newVote, id: old?.id || '', comment_id: commentId, user_id: old?.user_id || '', created_at: old?.created_at || new Date().toISOString(), updated_at: old?.updated_at || new Date().toISOString() } : null
            );

            return { previousVote, previousCount };
        },

        onError: (err, variables, context) => {
            console.error('Failed to vote on comment:', err);
            // Rollback on error
            if (context) {
                setUserVote(context.previousVote);
                setDisplayVoteCount(context.previousCount);
                utils.postComment.getUserCommentVote.setData({ commentId }, (old) =>
                    context.previousVote ? { ...old, vote_type: context.previousVote, id: old?.id || '', comment_id: commentId, user_id: old?.user_id || '', created_at: old?.created_at || new Date().toISOString(), updated_at: old?.updated_at || new Date().toISOString() } : null
                );
            }
        },

        onSettled: () => {
            // Sync with server
            utils.postComment.getUserCommentVote.invalidate({ commentId });
            utils.postComment.getPostComments.invalidate();
            utils.postComment.getCommentReplies.invalidate();
        },
    });

    const handleVote = (voteType: 'up' | 'down') => {
        if (!session) return;
        voteMutation.mutate({ commentId, voteType });
    };

    return {
        displayVoteCount,
        userVote,
        handleVote,
        isLoading: voteMutation.isPending,
    };
}
