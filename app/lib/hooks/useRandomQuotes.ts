import { useQuery } from '@tanstack/react-query';

export function useRandomQuotes(limit: number = 1) {
    return useQuery({
        queryKey: ['randomQuotes', limit],
        queryFn: async () => {
            const response = await fetch(`/api/random?limit=${limit}`);
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