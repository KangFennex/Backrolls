import { useQuery } from '@tanstack/react-query';
import { QuizQuestion } from '../definitions';

interface QuizResponse {
    success: boolean;
    data?: QuizQuestion[];
    error?: string;
}

async function fetchQuizQuotes(limit: number = 10): Promise<QuizQuestion[]> {
    const response = await fetch(`/api/quiz?limit=${limit}`);

    if (!response.ok) {
        throw new Error('Failed to fetch quiz questions');
    }

    const result: QuizResponse = await response.json();

    if (!result.success || !result.data) {
        throw new Error(result.error || 'No quiz data available');
    }

    return result.data;
}

export function useQuizQuotes(limit: number = 10) {
    return useQuery({
        queryKey: ['quizBackrolls', limit],
        queryFn: () => fetchQuizQuotes(limit),
        staleTime: Infinity, // Always fetch fresh quiz questions // Not, changed to Infinity
        gcTime: 0, // Don't cache quiz questions (was cacheTime in v4) // Why not cache?
        refetchOnWindowFocus: false, // Don't refetch when user returns to tab (they're mid-quiz)
    });
}
