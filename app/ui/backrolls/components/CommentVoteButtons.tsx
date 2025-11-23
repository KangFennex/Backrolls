// components/backrolls/components/CommentVoteButtons.tsx
'use client';

import { useState } from 'react';
import { trpc } from '../../../lib/trpc';
import { useSession } from 'next-auth/react';
import { AiOutlineLike, AiOutlineDislike } from "react-icons/ai";

interface CommentVoteButtonsProps {
    commentId: string;
    initialVoteCount: number;
}

export default function CommentVoteButtons({
    commentId,
    initialVoteCount
}: CommentVoteButtonsProps) {
    const [displayVoteCount, setDisplayVoteCount] = useState(initialVoteCount);
    const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);
    const { data: session } = useSession();
    const voteMutation = trpc.comments.vote.useMutation();

    const handleVote = (voteType: 'up' | 'down') => {
        if (!session) return;

        const oldVote = userVote;

        // Optimistic update
        if (oldVote === voteType) {
            // Remove vote
            setUserVote(null);
            setDisplayVoteCount(prev => prev + (voteType === 'up' ? -1 : 1));
        } else if (oldVote === null) {
            // Add vote
            setUserVote(voteType);
            setDisplayVoteCount(prev => prev + (voteType === 'up' ? 1 : -1));
        } else {
            // Switch vote
            setUserVote(voteType);
            setDisplayVoteCount(prev => prev + (voteType === 'up' ? 2 : -2));
        }

        // Server update
        voteMutation.mutate({ commentId, voteType });
    };

    if (!session) {
        return (
            <div className="flex items-center gap-2 text-gray-400">
                <AiOutlineLike size={16} />
                <span className="text-sm">{displayVoteCount}</span>
                <AiOutlineDislike size={16} />
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2">
            <button
                onClick={() => handleVote('up')}
                disabled={voteMutation.isPending}
                className={`p-1 rounded transition-all duration-200 ${userVote === 'up'
                    ? 'text-pink-400 bg-pink-400 bg-opacity-10'
                    : 'text-gray-400 hover:text-pink-400 hover:bg-gray-700'
                    }`}
            >
                <AiOutlineLike size={16} />
            </button>

            <span className={`text-sm font-medium min-w-8 text-center ${displayVoteCount > 0 ? 'text-pink-400' :
                displayVoteCount < 0 ? 'text-blue-400' : 'text-gray-400'
                }`}>
                {displayVoteCount > 0 ? '+' : ''}{displayVoteCount}
            </span>

            <button
                onClick={() => handleVote('down')}
                disabled={voteMutation.isPending}
                className={`p-1 rounded transition-all duration-200 ${userVote === 'down'
                    ? 'text-blue-400 bg-blue-400 bg-opacity-10'
                    : 'text-gray-400 hover:text-blue-400 hover:bg-gray-700'
                    }`}
            >
                <AiOutlineDislike size={16} />
            </button>
        </div>
    );
}