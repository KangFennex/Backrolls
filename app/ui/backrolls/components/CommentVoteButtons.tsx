// components/backrolls/components/CommentVoteButtons.tsx
'use client';

import { useSession } from 'next-auth/react';
import { AiOutlineLike, AiOutlineDislike } from "react-icons/ai";
import { useCommentVote } from '../../../lib/hooks/useCommentVote';

interface CommentVoteButtonsProps {
    commentId: string;
    initialVoteCount: number;
}

export default function CommentVoteButtons({
    commentId,
    initialVoteCount
}: CommentVoteButtonsProps) {
    const { data: session } = useSession();
    const { displayVoteCount, userVote, handleVote, isLoading } = useCommentVote({
        commentId,
        initialVoteCount,
    });

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
                disabled={isLoading}
                className={`p-1 rounded transition-all duration-200 ${userVote === 'up'
                    ? 'text-pink-400 hover:text-pink-300'
                    : 'text-gray-400 hover:text-pink-400 hover:bg-gray-700'
                    }`}
            >
                <AiOutlineLike size={16} />
            </button>

            <span className={`text-sm font-medium min-w-4 text-center ${displayVoteCount > 0 ? 'text-pink-400' :
                displayVoteCount < 0 ? 'text-blue-400' : 'text-gray-400'
                }`}>
                {displayVoteCount}
            </span>

            <button
                onClick={() => handleVote('down')}
                disabled={isLoading}
                className={`p-1 rounded transition-all duration-200 ${userVote === 'down'
                    ? 'text-blue-400 hover:text-blue-300'
                    : 'text-gray-400 hover:text-blue-400 hover:bg-gray-700'
                    }`}
            >
                <AiOutlineDislike size={16} />
            </button>
        </div>
    );
}
