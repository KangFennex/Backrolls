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
            <DialogTitle sx={{
                p: '1rem 1.5rem',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
                <FilterHeader onClose={toggleFilters} />
            </DialogTitle>
            <DialogContent sx={{
                p: { xs: '1rem 0.5rem', sm: '1.5rem' },
                minHeight: '400px',
                maxHeight: '60vh',
                overflowY: 'auto',
                '&::-webkit-scrollbar': {
                    width: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                },
                '&::-webkit-scrollbar-thumb': {
                    backgroundColor: 'var(--dark-pink)',
                    borderRadius: '4px',
                    '&:hover': {
                        opacity: 0.9,
                    }
                },
                '&::-webkit-scrollbar-track': {
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    borderRadius: '4px',
                }
            }}>
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

            <DialogActions sx={{
                p: '1rem 1.5rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                gap: '0.75rem'
            }}>
                <Button
                    onClick={handleReset}
                    sx={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        color: 'rgba(255, 255, 240, 0.8)',
                        border: '1px solid rgba(255, 255, 240, 0.3)',
                        borderRadius: '10px',
                        padding: '0.75rem 1.5rem',
                        fontSize: '1rem',
                        fontWeight: 600,
                        textTransform: 'none',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            background: 'rgba(255, 255, 255, 0.08)',
                            borderColor: 'rgba(255, 255, 240, 0.5)',
                            transform: 'translateY(-1px)'
                        },
                        '&:active': {
                            transform: 'scale(0.98)'
                        }
                    }}
                >
                    Reset
                </Button>
                <Button
                    onClick={handleApply}
                    sx={{
                        background: 'linear-gradient(135deg, rgba(238, 91, 172, 0.9) 0%, rgba(233, 144, 193, 0.9) 100%)',
                        color: '#FFFFF0',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '10px',
                        padding: '0.75rem 1.5rem',
                        fontSize: '1rem',
                        fontWeight: 600,
                        textTransform: 'none',
                        boxShadow: '0 4px 12px rgba(238, 91, 172, 0.3)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            background: 'linear-gradient(135deg, rgba(238, 91, 172, 1) 0%, rgba(233, 144, 193, 1) 100%)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 6px 16px rgba(238, 91, 172, 0.4)'
                        },
                        '&:active': {
                            transform: 'scale(0.98)'
                        }
                    }}
                >
                    Apply
                </Button>
            </DialogActions>
        </>
    );
}
