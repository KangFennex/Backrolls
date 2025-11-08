import { useSuspenseQuery } from '@tanstack/react-query';

export function useHotQuotes(limit: number = 10) {
    return useSuspenseQuery({
        queryKey: ['hotQuotes', limit],
        queryFn: async () => {
            const response = await fetch('/api/hot');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        },
        staleTime: 1000 * 60 * 2, // 2 minutes - fresh quotes cache briefly
        refetchOnWindowFocus: true, // Get latest when user returns
    });
}