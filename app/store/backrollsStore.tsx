import { create } from 'zustand';
import { Quote } from '../lib/definitions';

// Filter state type
type FilterState = {
    selectedRegion: string;
    selectedSeries: string | null;
    selectedSeason: number | null;
    selectedEpisode: number | null;
}

type BackrollsState = {
    quotes: Quote[];
    displayResults: Quote[];
    favorites: string[];
    votes: Record<string, 'upvote' | 'downvote'>;
    shares: Record<string, number>;
    currentUser: string | null;
    isLoading: boolean;

    // Filter state
    filters: FilterState;

    // Actions
    setCurrentUser: (userId: string | null) => void;
    setDisplayResults: (results: Quote[]) => void;
    loadUserData: () => Promise<void>;
    setFavorites: (favorites: string[]) => void;
    toggleFavorite: (quote_id: string) => Promise<void>;
    syncWithDatabase: () => Promise<void>;
    clearUserData: () => void;

    // Filter actions
    setFilters: (filters: Partial<FilterState>) => void;
    clearFilters: () => void;
    initFiltersFromUrl: (searchParams: URLSearchParams) => void;
    updateUrlFromFilters: (router: { replace: (url: string, options?: { scroll: boolean }) => void }, pathname: string) => void;
    hasActiveFilters: () => boolean;

    // Voting actions
    vote: (quote_id: string, vote_type: 'upvote' | 'downvote') => Promise<void>;
    upvote: (quote_id: string) => Promise<void>;
    downvote: (quote_id: string) => Promise<void>;
    hasUpvoted: (quote_id: string) => boolean;
    hasDownvoted: (quote_id: string) => boolean;
    getVoteCount: (quote_id: string) => number;
}

export const useBackrollsStore = create<BackrollsState>((set, get) => ({
    quotes: [],
    displayResults: [],
    favorites: [],
    votes: {},
    shares: {},
    currentUser: null,
    isLoading: false,

    // Initialize filter state with defaults
    filters: {
        selectedRegion: 'americas',
        selectedSeries: 'rpdr',
        selectedSeason: null,
        selectedEpisode: null,
    },

    // Set current user (without triggering data load - prevents infinite loops)
    setCurrentUser: async (userId: string | null) => {
        const currentUserId = get().currentUser;

        // Only update if user actually changed
        if (currentUserId === userId) return;

        set({ currentUser: userId });

        // Only clear data when logging out, don't auto-load on login
        if (!userId) {
            get().clearUserData();
        }
    },

    setDisplayResults: (results: Quote[]) => {
        set({ displayResults: results });
    },

    // Load user-specific data (favorites, votes, shares)
    loadUserData: async () => {
        set({ isLoading: true });

        try {
            // Fetch favorites
            const favoritesResponse = await fetch(`/api/favorites`, {
                credentials: 'include'
            });
            if (favoritesResponse.ok) {
                const data = await favoritesResponse.json();
                set({ favorites: data.favoriteIds || [] });
            }

            // Fetch votes
            const voteResponse = await fetch(`/api/votes`, {
                credentials: 'include'
            });

            if (voteResponse.ok) {
                const { votes } = await voteResponse.json();

                const votesRecords: Record<string, 'upvote' | 'downvote'> = {};

                votes.forEach((vote: { quote_id: string, vote_type: 'upvote' | 'downvote' }) => {
                    votesRecords[vote.quote_id] = vote.vote_type;
                });

                set({ votes: votesRecords });
            }

            // Fetch shares

        } catch (error) {
            console.error('Error loading user data:', error);

        } finally {
            set({ isLoading: false });
        }
    },

    // Favorites
    setFavorites: (favorites: string[]) => {
        set({ favorites });
    },

    // Toggle favorite
    toggleFavorite: async (quote_id: string) => {
        const { currentUser, favorites } = get();

        if (!currentUser) {
            console.warn('No user logged in. Cannot toggle favorite.');
            return;
        }

        // Optimistically update UI
        const isFavorited = favorites.includes(quote_id);
        const newFavorites = isFavorited
            ? favorites.filter(id => id !== quote_id)
            : [...favorites, quote_id];

        set({ favorites: newFavorites });
        console.log("Optimistically toggled favorite for quote_id:", quote_id, "New favorites:", newFavorites, "User:", currentUser);

        try {
            // Sync with database via API Route
            const response = await fetch('/api/favorites', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ quote_id }),
                credentials: 'include'
            });

            const result = await response.json();

            if (!result.success) {
                // Revert optimistic update on failure
                set({ favorites });
                console.error('Failed to toggle favorite on server:', result.error);
            }
        } catch (error) {
            // Revert optimistic update on error
            set({ favorites });
            console.error('Error toggling favorite:', error);
        }
    },

    getVoteCount: (quote_id: string) => {
        const { quotes, displayResults } = get();

        const quote = displayResults.find(q => q.id === quote_id) || quotes.find(q => q.id === quote_id);

        if (!quote) {
            console.warn('Quote not found for vote count:', quote_id);
            return 0;
        }

        return quote?.vote_count || 0;
    },

    // Update the vote function to refresh count after voting
    vote: async (quote_id: string, vote_type: 'upvote' | 'downvote') => {
        const { currentUser, votes } = get();

        if (!currentUser) {
            console.warn('No user logged in. Cannot vote.');
            return;
        }

        const currentVote = votes[quote_id];
        const newVotes = { ...votes };

        if (!currentVote) {
            // User is casting a new vote
            newVotes[quote_id] = vote_type;
        } else if (currentVote === vote_type) {
            // User is removing their vote
            delete newVotes[quote_id];
        } else {
            // User is switching their vote
            newVotes[quote_id] = vote_type;
        }

        // Optimistically update UI
        set({ votes: newVotes });

        try {

            console.log('🔍 Sending vote request:', { quote_id, vote_type });

            const response = await fetch('/api/votes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ quote_id, vote_type }),
                credentials: 'include'
            });

            console.log('🔍 Response status:', response.status);
            console.log('🔍 Response ok:', response.ok);

            const result = await response.json();
            console.log('🔍 Response result:', result);
            console.log(quote_id, 'vote toggled to', vote_type, 'Result from server:', result);

            if (result.success) {
                // Refresh vote count for the affected quote
                const { displayResults, quotes } = get();

                const updatedDisplayResults = displayResults.map(quote =>
                    quote.id === quote_id
                        ? { ...quote, vote_count: result.newVoteCount }
                        : quote
                );

                const updatedQuotes = quotes.map(quote =>
                    quote.id === quote_id
                        ? { ...quote, vote_count: result.newVoteCount }
                        : quote
                );

                set({ displayResults: updatedDisplayResults, quotes: updatedQuotes });

                window.dispatchEvent(new CustomEvent('voteUpdated', {
                    detail: {
                        quoteId: quote_id,
                        newVoteCount: result.newVoteCount
                    }
                }));

                console.log('✅ Updated vote count to:', result.newVoteCount)
            } else {
                console.error('Failed to toggle vote on server:', result.error);
                set({ votes }); // Revert optimistic update
            }

        } catch (error) {
            console.error('Error toggling vote:', error);
            set({ votes }); // Revert optimistic update
        }
    },

    upvote: async (quote_id: string) => {
        await get().vote(quote_id, 'upvote');
    },

    downvote: async (quote_id: string) => {
        await get().vote(quote_id, 'downvote');
    },

    hasUpvoted: (quote_id: string) => {
        return get().votes[quote_id] === 'upvote';
    },

    hasDownvoted: (quote_id: string) => {
        return get().votes[quote_id] === 'downvote';
    },

    // Sync local state with database (call periodically)
    syncWithDatabase: async () => {
        const { currentUser } = get();
        if (currentUser) {
            await get().loadUserData();
        }
    },

    clearUserData: () => {
        set({
            favorites: [],
            votes: {},
            shares: {},
            currentUser: null
        });
    },

    // Filter actions
    setFilters: (newFilters: Partial<FilterState>) => {
        console.log('🎯 Setting filters in store:', newFilters);
        set(state => ({
            filters: { ...state.filters, ...newFilters }
        }));
    },

    clearFilters: () => {
        console.log('🔄 Clearing all filters to defaults');
        set({
            filters: {
                selectedRegion: 'americas',
                selectedSeries: 'rpdr',
                selectedSeason: null,
                selectedEpisode: null,
            }
        });
    },

    initFiltersFromUrl: (searchParams: URLSearchParams) => {
        const regionFromURL = searchParams.get('region') || 'americas';
        const seriesFromURL = searchParams.get('series') || 'rpdr';
        const seasonFromURL = searchParams.get('season');
        const episodeFromURL = searchParams.get('episode');

        const newFilters: FilterState = {
            selectedRegion: regionFromURL,
            selectedSeries: seriesFromURL,
            selectedSeason: seasonFromURL ? parseInt(seasonFromURL) : null,
            selectedEpisode: episodeFromURL ? parseInt(episodeFromURL) : null,
        };

        console.log('🔄 Initializing filters from URL:', newFilters);
        set({ filters: newFilters });
    },

    updateUrlFromFilters: (router: { replace: (url: string, options?: { scroll: boolean }) => void }, pathname: string) => {
        const { filters } = get();
        const params = new URLSearchParams();

        params.set('region', filters.selectedRegion);

        if (filters.selectedSeries) {
            params.set('series', filters.selectedSeries);
        }

        if (filters.selectedSeason !== null) {
            params.set('season', filters.selectedSeason.toString());
        }

        if (filters.selectedEpisode !== null) {
            params.set('episode', filters.selectedEpisode.toString());
        }

        const newURL = `${pathname}${params.toString() ? '?' + params.toString() : ''}`;
        router.replace(newURL, { scroll: false });
    },

    hasActiveFilters: () => {
        const { filters } = get();
        return filters.selectedRegion !== 'americas' ||
            filters.selectedSeries !== null ||
            filters.selectedSeason !== null ||
            filters.selectedEpisode !== null;
    },
}));
