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
    const [isExpanded, setIsExpanded] = useState(false);

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
        <div className="w-full">
            {/* Header with expand/collapse button */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800 m-0">
                    My Favorites ({favoritesData.length})
                </h3>
                {favoritesData.length > 0 && (
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="bg-white/70 hover:bg-white/90 border-none rounded-full w-8 h-8 cursor-pointer flex items-center justify-center text-lg transition-colors duration-200"
                    >
                        {isExpanded ? '▲' : '▼'}
                    </button>
                )}
            </div>

            {/* Favorites container */}
            <div className={`w-full ${isExpanded ? 'h-auto max-h-[500px]' : 'h-[200px] max-h-[200px]'} overflow-hidden relative`}>
                {favoritesData.length === 0 ? (
                    <p className="text-gray-500 italic">No favorites yet!</p>
                ) : (
                    <div className={`
                        flex 
                        ${isExpanded ? 'flex-wrap' : 'flex-nowrap'}
                        justify-center
                        gap-2
                        p-2 
                        h-full 
                        w-full
                        max-w-full
                        ${isExpanded ? 'overflow-hidden' : 'overflow-x-auto'} 
                        overflow-y-hidden 
                        scrollbar-hide
                        ${isExpanded ? '' : 'min-w-0'}
                    `}>
                        {favoritesData.map(quote => (
                            <div
                                key={quote.id}
                                className={`${isExpanded ? 'flex-shrink' : 'flex-shrink-0'}`}
                            >
                                <QuoteCard
                                    quote={quote}
                                    variant="compact"
                                    onRemoveFavorite={removeFavoriteFromData}
                                    onDoubleClick={() => handleDoubleClick(quote)}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};