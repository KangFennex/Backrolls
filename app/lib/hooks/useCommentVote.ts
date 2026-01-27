'use client';

import { useState, useEffect } from 'react';
import { trpc } from '../trpc';
import { useSession } from 'next-auth/react';

interface UseCommentVoteProps {
    commentId: string;
    initialVoteCount: number;
}

export function useCommentVote({ commentId, initialVoteCount }: UseCommentVoteProps) {
    const [displayVoteCount, setDisplayVoteCount] = useState(initialVoteCount);
    const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);
    const { data: session } = useSession();
    const utils = trpc.useUtils();

    // Fetch user's current vote for this comment
    const { data: userVoteData } = trpc.comments.getUserCommentVote.useQuery(
        { commentId },
        {
            enabled: !!session && !!commentId,
        }
    );

    // Update userVote when data is fetched
    useEffect(() => {
        if (userVoteData !== undefined) {
            setUserVote(userVoteData);
        }
    }, [userVoteData]);

    // Vote mutation with optimistic updates
    const voteMutation = trpc.comments.vote.useMutation({
        onMutate: async (variables) => {
            // Cancel outgoing refetches
            await utils.comments.getUserCommentVote.cancel({ commentId });

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

            // Optimistically update cache
            utils.comments.getUserCommentVote.setData({ commentId }, newVote);

            return { previousVote, previousCount };
        },

        onError: (err, variables, context) => {
            console.error('Failed to vote on comment:', err);
            // Rollback on error
            if (context) {
                setUserVote(context.previousVote);
                setDisplayVoteCount(context.previousCount);
                utils.comments.getUserCommentVote.setData({ commentId }, context.previousVote);
            }
        },

        onSuccess: (data) => {
            // Update with actual server response
            setDisplayVoteCount(data.comment.vote_count);
        },

        onSettled: () => {
            // Sync with server
            utils.comments.getUserCommentVote.invalidate({ commentId });
            utils.comments.getCommentsByQuoteId.invalidate();
            utils.comments.getCommentReplies.invalidate();
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
