import { useSuspenseQuery } from '@tanstack/react-query';

export function useWorkroomQuotes(limit: number = 1) {
    return useSuspenseQuery({
        queryKey: ['workroomQuotes', limit],
        queryFn: async () => {
            // Construct absolute URL for SSR compatibility
            const baseUrl = typeof window === 'undefined' 
                ? process.env.NEXTAUTH_URL || 'http://localhost:3000'
                : '';
            const url = `${baseUrl}/api/workroom?limit=${limit}`;
            
            const response = await fetch(url);
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