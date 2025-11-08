import { useSuspenseQuery } from '@tanstack/react-query';

export function useHotQuotes(limit: number = 10) {
    return useSuspenseQuery({
        queryKey: ['hotQuotes', limit],
        queryFn: async () => {

            // Absolute URL for SSR compatibility
            const baseUrl = typeof window === 'undefined'
                ? process.env.NEXTAUTH_URL || 'http://localhost:3000'
                : '';
            const url = `${baseUrl}/api/hot?limit=${limit}`;

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        },
        staleTime: 1000 * 60 * 2, // 2 minutes - fresh quotes cache briefly
        refetchOnWindowFocus: true, // Get latest when user returns
    });
}