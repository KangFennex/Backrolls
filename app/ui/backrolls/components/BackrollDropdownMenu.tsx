'use client';

import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';
import { MdEdit, MdDelete } from "react-icons/md";
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { MdReportGmailerrorred } from "react-icons/md";
import { useFavorites, useToggleFavorite, useAuth } from '../../../lib/hooks';

interface BackrollDropdownMenuProps {
    menuRef: React.RefObject<HTMLDivElement | null>;
    menuPosition: { top: number; left: number };
    isOwner: boolean;
    isDeleting: boolean;
    quoteId: string;
    onReport: (e: React.MouseEvent) => void;
    onEdit: (e: React.MouseEvent) => void;
    onDelete: (e: React.MouseEvent) => void;
}

export default function BackrollDropdownMenu({
    menuRef,
    menuPosition,
    isOwner,
    isDeleting,
    quoteId,
    onReport,
    onEdit,
    onDelete,
}: BackrollDropdownMenuProps) {
    const { isAuthenticated } = useAuth();
    const { data: favoritesData } = useFavorites();
    const toggleFavoriteMutation = useToggleFavorite();
    const [guestFavorites, setGuestFavorites] = useState<Set<string>>(new Set());
    const [position, setPosition] = useState(menuPosition);

    // Determine if this quote is favorited
    const isFavorited = isAuthenticated
        ? favoritesData?.favoriteIds.includes(quoteId) || false
        : guestFavorites.has(quoteId);

    useEffect(() => {
        setPosition(menuPosition);
    }, [menuPosition]);

    useEffect(() => {
        const handleScroll = () => {
            // Close menu on scroll to prevent positioning issues
        };

        window.addEventListener('scroll', handleScroll, true);
        return () => window.removeEventListener('scroll', handleScroll, true);
    }, []);

    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.stopPropagation();

        if (!isAuthenticated) {
            // Guest user - just toggle local state
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

        // Authenticated user - trigger mutation
        toggleFavoriteMutation.mutate({ quoteId });
    };

    if (typeof window === 'undefined') return null;

    return createPortal(
        <div
            ref={menuRef}
            className="flex flex-col bg-[rgba(30,30,40,0.95)] border border-white/15 rounded-lg overflow-hidden min-w-fit shadow-lg backdrop-blur-md"
            style={{
                position: 'absolute',
                top: `${position.top}px`,
                left: `${position.left}px`,
                zIndex: 9999,
            }}
        >
            <button
                className="flex items-center gap-2 w-full min-w-[120px] px-4 py-3 bg-transparent border-none text-white/80 font-['Google_Sans',sans-serif] text-sm text-left cursor-pointer transition-all duration-200 border-b border-white/5 hover:bg-pink-500/10 hover:text-pink-500 active:bg-pink-500/20"
                onClick={handleFavoriteClick}
                disabled={toggleFavoriteMutation.isPending}
            >
                {isFavorited ? (
                    <FaHeart size={18} className="flex-shrink-0" style={{ color: '#EE5BAC' }} />
                ) : (
                    <FaRegHeart size={18} className="flex-shrink-0" />
                )}
                {isFavorited ? 'Unfavourite' : 'Favourite'}
            </button>
            <button
                className="flex items-center gap-2 w-full min-w-[120px] px-4 py-3 bg-transparent border-none text-white/80 font-['Google_Sans',sans-serif] text-sm text-left cursor-pointer transition-all duration-200 border-b border-white/5 hover:bg-pink-500/10 hover:text-pink-500 active:bg-pink-500/20"
                onClick={onReport}
            >
                <MdReportGmailerrorred size={18} className="flex-shrink-0" />
                Report
            </button>
            {isOwner && (
                <>
                    <button
                        className="flex items-center gap-2 w-full min-w-[120px] px-4 py-3 bg-transparent border-none text-white/80 font-['Google_Sans',sans-serif] text-sm text-left cursor-pointer transition-all duration-200 border-b border-white/5 hover:bg-pink-500/10 hover:text-pink-500 active:bg-pink-500/20"
                        onClick={onEdit}
                    >
                        <MdEdit size={18} className="flex-shrink-0" />
                        Edit
                    </button>
                    <button
                        className="flex items-center gap-2 w-full min-w-[120px] px-4 py-3 bg-transparent border-none text-[rgba(255,107,107,0.9)] font-['Google_Sans',sans-serif] text-sm text-left cursor-pointer transition-all duration-200 hover:bg-red-500/10 hover:text-red-500 active:bg-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={onDelete}
                        disabled={isDeleting}
                    >
                        <MdDelete size={18} className="flex-shrink-0" />
                        {isDeleting ? 'Deleting...' : 'Delete'}
                    </button>
                </>
            )}
        </div>,
        document.body
    );
}
