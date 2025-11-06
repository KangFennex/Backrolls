'use client'

import * as React from 'react';
import { useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useBackrollsStore } from '../../store/backrollsStore';
import { Box, SwipeableDrawer } from '@mui/material';
import FilterHeader from './components/FilterHeader';
import FilterControls from './components/FilterControls';
import FilterActions from './components/FilterActions';
import { FilterDrawerProps } from '../../lib/definitions';

const drawerWidth = 260;

export default function FilterDrawer({ open, onClose }: FilterDrawerProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    // Get filter state and actions from store
    const {
        filters,
        setFilters,
        clearFilters,
        initFiltersFromUrl,
        updateUrlFromFilters,
        hasActiveFilters,
    } = useBackrollsStore();

    const { seriesCategory, selectedSeries, selectedSeason, selectedEpisode } = filters;

    // Initialize filters from URL on component mount (URL takes precedence)
    useEffect(() => {
        const hasUrlParams = searchParams.has('category') || searchParams.has('series') ||
            searchParams.has('season') || searchParams.has('episode');

        if (hasUrlParams) {
            // URL has precedence - update store to match
            initFiltersFromUrl(searchParams);
        } else {
            // No URL params - update URL to match store state if filters are active
            const storeFilters = useBackrollsStore.getState().filters;
            const hasActiveStoreFilters = storeFilters.selectedSeries ||
                storeFilters.selectedSeason ||
                storeFilters.selectedEpisode ||
                storeFilters.seriesCategory !== 'main-series';

            if (hasActiveStoreFilters) {
                updateUrlFromFilters(router, pathname);
            }
        }
    }, [searchParams, initFiltersFromUrl, updateUrlFromFilters, router, pathname]);

    // Event handlers using store
    const handleCategoryChange = (category: string | number | null) => {
        if (typeof category === 'string') {
            console.log('Category change handler called with:', category);

            // Handle main-series auto-selection
            let newSeries = null;
            if (category === 'main-series') {
                newSeries = "RuPaul's Drag Race";
            }

            setFilters({
                seriesCategory: category,
                selectedSeries: newSeries,
                selectedSeason: null,
                selectedEpisode: null,
            });
        }
    };

    const handleSeriesChange = (series: string | number | null) => {
        setFilters({
            selectedSeries: typeof series === 'string' ? series : null,
            selectedSeason: null,
            selectedEpisode: null,
        });
    };

    const handleSeasonChange = (season: string | number | null) => {
        setFilters({
            selectedSeason: typeof season === 'number' ? season : null,
            selectedEpisode: null,
        });
    };

    const handleEpisodeChange = (episode: string | number | null) => {
        setFilters({
            selectedEpisode: typeof episode === 'number' ? episode : null,
        });
    };

    const handleApplyFilters = () => {
        // Update URL from current store state
        updateUrlFromFilters(router, '/series');
        onClose();
    };

    const handleClearFilters = () => {
        clearFilters();
        // Update URL to reflect cleared state
        updateUrlFromFilters(router, pathname);
    };

    const drawerContent = (
        <Box
            sx={{
                width: drawerWidth,
                height: '100%',
                backgroundColor: 'var(--rich-charcoal)',
                color: '#FFFFF0',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <FilterHeader onClose={onClose} />

            <FilterControls
                seriesCategory={seriesCategory}
                selectedSeries={selectedSeries}
                selectedSeason={selectedSeason}
                selectedEpisode={selectedEpisode}
                onCategoryChange={handleCategoryChange}
                onSeriesChange={handleSeriesChange}
                onSeasonChange={handleSeasonChange}
                onEpisodeChange={handleEpisodeChange}
            />

            <FilterActions
                seriesCategory={seriesCategory}
                hasActiveFilters={hasActiveFilters()}
                onApplyFilters={handleApplyFilters}
                onClearFilters={handleClearFilters}
            />
        </Box>
    );

    return (
        <SwipeableDrawer
            anchor="left"
            open={open}
            onClose={onClose}
            onOpen={() => { }} // Required for SwipeableDrawer
            variant="temporary"
            sx={{
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    height: '100%',
                    backgroundColor: 'var(--rich-charcoal)',
                    border: 'none',
                    boxShadow: '4px 0 20px rgba(0, 0, 0, 0.3)',
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    '&::-webkit-scrollbar': {
                        display: 'none',
                    },
                },
                '& .MuiBackdrop-root': {
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                }
            }}
        >
            {drawerContent}
        </SwipeableDrawer>
    );
}