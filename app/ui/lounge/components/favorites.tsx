import { useEffect, useState } from 'react';
import { useBackrollsStore } from '../../../store/backrollsStore';
import { QuoteCard } from '../../backrolls/backrollsCards';
import { Quote } from '../../../lib/definitions';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

export const RenderFavorites = () => {
    const currentUser = useBackrollsStore((state) => state.currentUser);
    const setFavorites = useBackrollsStore((state) => state.setFavorites);
    const setDisplayResultsToStore = useBackrollsStore((state) => state.setDisplayResults);
    const [favoritesData, setFavoritesData] = useState<Quote[]>([]);
    const [loading, setLoading] = useState(true);

    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const removeFavoriteFromData = (quoteId: string) => {
        setFavoritesData(prev => prev.filter(quote => quote.id !== quoteId));
    }

    const handleDoubleClick = (quote: Quote) => {
        console.log("Double clicked quote:", quote);

        const params = new URLSearchParams(searchParams);

        if (pathname !== '/backrolls') {
            params.delete('page');
        }

        // Set the quote as display result
        setDisplayResultsToStore([quote]);

        // Navigate to backrolls page
        replace(`/backrolls?${params.toString()}`);
    };

    useEffect(() => {
        const fetchFavorites = async () => {
            if (!currentUser) {
                setLoading(false);
                return;
            }

            try {
                const response = await fetch('/api/favorites', {
                    credentials: 'include'
                });

                if (response.ok) {
                    const data = await response.json();
                    setFavoritesData(data.favorites || []);
                    setFavorites(data.favoriteIds || []);

                } else {
                    console.error('Failed to fetch favorites');
                }
            } catch (error) {
                console.error('Error fetching favorites:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFavorites();
    }, [currentUser, setFavorites]);

    if (loading) {
        return <div>Loading favorites...</div>;
    }

    if (!currentUser) {
        return <div>Please log in to see your favorites.</div>;
    }

    return (
        <div className="favorites-container">
            {favoritesData.length === 0 ? (
                <p>No favorites yet!</p>
            ) : (
                <div className="favorites-grid flex gap-4">
                    {favoritesData.map(quote => (
                        <QuoteCard
                            key={quote.id}
                            quote={quote}
                            variant="compact"
                            onRemoveFavorite={removeFavoriteFromData}
                            onDoubleClick={() => handleDoubleClick(quote)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};