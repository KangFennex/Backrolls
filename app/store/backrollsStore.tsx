import { create } from 'zustand';

// Filter state type
type FilterState = {
    selectedRegion: string;
    selectedSeries: string | null;
    selectedSeason: number | null;
    selectedEpisode: number | null;
}

type BackrollsState = {
    currentUser: string | null;

    // Filter state
    filters: FilterState;

    // Actions
    setCurrentUser: (userId: string | null) => void;
    clearUserData: () => void;

    // Filter actions
    setFilters: (filters: Partial<FilterState>) => void;
    clearFilters: () => void;
    initFiltersFromUrl: (searchParams: URLSearchParams) => void;
    updateUrlFromFilters: (router: { replace: (url: string, options?: { scroll: boolean }) => void }, pathname: string) => void;
    hasActiveFilters: () => boolean;
}

export const useBackrollsStore = create<BackrollsState>((set, get) => ({
    currentUser: null,

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

    clearUserData: () => {
        set({
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
        const seriesFromURL = searchParams.get('series');
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
