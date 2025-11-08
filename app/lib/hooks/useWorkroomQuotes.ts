import { useSuspenseQuery } from '@tanstack/react-query';

export function useWorkroomQuotes(limit: number = 1) {
    return useSuspenseQuery({
        queryKey: ['workroomQuotes', limit],
        queryFn: async () => {
            const response = await fetch(`/api/workroom?limit=${limit}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        },
        staleTime: 1000 * 30,
        retry: 2,
        gcTime: 1000 * 60 * 2,
    });
}