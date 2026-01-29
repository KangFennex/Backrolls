'use client';

import '@/app/scss/components/ActionButtons.scss';
import { useState } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useAuth } from '../../../lib/hooks';
import { useFavorites, useToggleFavorite } from '../../../lib/hooks';
import React from 'react';

export function FavoriteButton({
    quoteId,
    onRemoveFavorite,
}: {
    quoteId: string;
    onRemoveFavorite?: (quote_id: string) => void;
}) {
    const { isAuthenticated } = useAuth();

    // Server-side favorites (authenticated users)
    const { data: favoritesData } = useFavorites();
    const toggleFavoriteMutation = useToggleFavorite();

    // Local state for guest users (not persisted)
    const [guestFavorites, setGuestFavorites] = useState<Set<string>>(new Set());

    // Determine if this quote is favorited
    const isFavorited = isAuthenticated
        ? favoritesData?.favoriteIds.includes(quoteId) || false
        : guestFavorites.has(quoteId);

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();

        if (!isAuthenticated) {
            // Guest user - just toggle local state (instant, no server call)
            setGuestFavorites(prev => {
                const newSet = new Set(prev);
                if (newSet.has(quoteId)) {
                    newSet.delete(quoteId);
                } else {
                    newSet.add(quoteId);
                }
                return newSet;
            });
            return;
        }

        // If removing favorite and callback provided, call it
        if (isFavorited && onRemoveFavorite) {
            onRemoveFavorite(quoteId);
        }

        // Authenticated user - trigger mutation with optimistic update
        toggleFavoriteMutation.mutate({ quoteId: quoteId });
    };

    return (
        <button
            onClick={handleClick}
            className="action-btn__icon-only"
            aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
            disabled={toggleFavoriteMutation.isPending}
        >
            {isFavorited ? (
                <FaHeart size={18} className="action-btn__icon active" />
            ) : (
                <FaRegHeart size={18} className="action-btn__icon" />
            )}
        </button>
    );
}
