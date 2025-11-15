'use client'

import { useState, useEffect } from 'react';
import {
    Button,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
} from '@mui/material';
import { FilterHeader, ActiveFiltersChips } from './components';
import RegionFilter from './components/RegionFilter';
import SeriesFilter from './components/SeriesFilter';
import SeasonFilter from './components/SeasonFilter';
import EpisodeFilter from './components/EpisodeFilter';
import { useFiltersContext } from '../../context/FiltersModalContext';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useBackrollsStore } from '../../store/backrollsStore';

export default function FiltersModalContent() {
    const { toggleFilters } = useFiltersContext();

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

    // Get filter values from store
    const { selectedRegion, selectedSeries, selectedSeason, selectedEpisode } = filters;

    // Local state for UI (synced with store on Apply)
    const [localRegion, setLocalRegion] = useState<string>(selectedRegion);
    const [localSeries, setLocalSeries] = useState<string | null>(selectedSeries);
    const [localSeason, setLocalSeason] = useState<number | null>(selectedSeason);
    const [localEpisode, setLocalEpisode] = useState<number | null>(selectedEpisode);

    // Initialize filters from URL on component mount (URL takes precedence)
    useEffect(() => {
        const hasUrlParams = searchParams.has('region') || searchParams.has('series') ||
            searchParams.has('season') || searchParams.has('episode');

        if (hasUrlParams) {
            // URL has precedence - update store to match
            initFiltersFromUrl(searchParams);
        } else if (hasActiveFilters()) {
            // No URL params but store has active filters - update URL to match
            updateUrlFromFilters(router, pathname);
        }
    }, [searchParams, initFiltersFromUrl, updateUrlFromFilters, router, pathname, hasActiveFilters]);

    // Sync local state with store when store changes (e.g., from URL)
    useEffect(() => {
        setLocalRegion(selectedRegion);
        setLocalSeries(selectedSeries);
        setLocalSeason(selectedSeason);
        setLocalEpisode(selectedEpisode);
    }, [selectedRegion, selectedSeries, selectedSeason, selectedEpisode]);

    // Chip removal handlers
    const removeFilter = (filterType: string) => {
        switch (filterType) {
            case 'region':
                setLocalRegion('americas');
                setLocalSeries('rpdr');
                setLocalSeason(null);
                setLocalEpisode(null);
                break;
            case 'series':
                setLocalSeries(null);
                setLocalSeason(null);
                setLocalEpisode(null);
                break;
            case 'season':
                setLocalSeason(null);
                setLocalEpisode(null);
                break;
            case 'episode':
                setLocalEpisode(null);
                break;
        }
    };

    const handleReset = () => {
        setLocalRegion('americas');
        setLocalSeries('rpdr');
        setLocalSeason(null);
        setLocalEpisode(null);
        clearFilters();
        updateUrlFromFilters(router, pathname);
    };

    const handleRegionChange = (region: string) => {
        setLocalRegion(region);
        setLocalSeries(null);
        setLocalSeason(null);
        setLocalEpisode(null);
    };

    const handleSeriesChange = (series: string | null) => {
        setLocalSeries(series);
        setLocalSeason(null);
        setLocalEpisode(null);
    };

    const handleSeasonChange = (season: number | null) => {
        setLocalSeason(season);
        setLocalEpisode(null);
    };

    const handleApply = () => {
        console.log('Applying filters:', {
            region: localRegion,
            series: localSeries,
            season: localSeason,
            episode: localEpisode,
        });
        
        // Update store first
        setFilters({
            selectedRegion: localRegion,
            selectedSeries: localSeries,
            selectedSeason: localSeason,
            selectedEpisode: localEpisode,
        });
        
        // Build URL with query params directly from local state
        const params = new URLSearchParams();
        params.set('region', localRegion);
        
        if (localSeries) {
            params.set('series', localSeries);
        }
        
        if (localSeason !== null) {
            params.set('season', localSeason.toString());
        }
        
        if (localEpisode !== null) {
            params.set('episode', localEpisode.toString());
        }
        
        // Navigate to series page with filters
        router.push(`/series?${params.toString()}`);
        toggleFilters();
    };

    return (
        <>
            <DialogTitle sx={{ pb: 1 }}>
                <FilterHeader onClose={toggleFilters} />
            </DialogTitle>
            <DialogContent sx={{ backgroundColor: 'var(--rich-charcoal)', minHeight: '400px' }}>
                {/* Active Filters Chips */}
                <ActiveFiltersChips
                    selectedRegion={localRegion}
                    selectedSeriesCode={localSeries}
                    selectedSeason={localSeason}
                    selectedEpisode={localEpisode}
                    onRemoveFilter={removeFilter}
                />

                {/* Filter Controls */}
                <Stack spacing={3}>
                    <RegionFilter
                        value={localRegion}
                        onChange={handleRegionChange}
                    />

                    <SeriesFilter
                        region={localRegion}
                        value={localSeries}
                        onChange={handleSeriesChange}
                    />

                    <SeasonFilter
                        seriesCode={localSeries}
                        value={localSeason}
                        onChange={handleSeasonChange}
                    />

                    <EpisodeFilter
                        seriesCode={localSeries}
                        season={localSeason}
                        value={localEpisode}
                        onChange={setLocalEpisode}
                    />
                </Stack>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2, backgroundColor: 'var(--rich-charcoal)' }}>
                <Button
                    onClick={handleReset}
                    variant="outlined"
                    sx={{
                        borderColor: 'rgba(255, 255, 240, 0.3)',
                        color: 'rgba(255, 255, 240, 0.7)',
                        '&:hover': {
                            borderColor: 'rgba(255, 255, 240, 0.5)',
                            backgroundColor: 'rgba(255, 255, 255, 0.05)'
                        }
                    }}
                >
                    Reset
                </Button>
                <Button
                    onClick={handleApply}
                    variant="contained"
                    sx={{
                        backgroundColor: 'var(--dark-pink)',
                        color: '#FFFFF0',
                        '&:hover': {
                            backgroundColor: 'hsl(327, 81%, 50%)'
                        }
                    }}
                >
                    Apply
                </Button>
            </DialogActions>
        </>
    );
}
