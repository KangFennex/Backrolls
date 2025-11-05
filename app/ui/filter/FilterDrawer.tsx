'use client'

import * as React from 'react';
import { useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useBackrollsStore } from '../../store/backrollsStore';
import { useSeriesFiltering } from '../../lib/hooks';
import {
    Drawer,
    Box,
    Typography,
    Divider,
    IconButton,
    Button,
    Stack
} from '@mui/material';
import { IoClose, IoFilterOutline } from "react-icons/io5";
import { MdClear } from "react-icons/md";
import SplitButton from './components/SplitButton';

interface FilterDrawerProps {
    open: boolean;
    onClose: () => void;
}

const drawerWidth = 320;

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

    const {
        getSeriesByCategory,
        getSeasonOptions,
        getEpisodeOptions,
    } = useSeriesFiltering();

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

    // Prepare options for each button
    const categoryOptions = [
        { value: 'main-series', label: 'Main Series' },
        { value: 'all-stars', label: 'All Stars' },
        { value: 'international', label: 'International' },
        { value: 'spin-off', label: 'Spin Off' }
    ];

    const availableSeries = seriesCategory ? getSeriesByCategory(seriesCategory) : [];

    const seriesOptions = availableSeries.map(series => ({
        value: series.name,
        label: series.name
    }));

    const seasonOptions = selectedSeries ? getSeasonOptions(selectedSeries) : [];

    const episodeOptions = selectedSeries && selectedSeason
        ? getEpisodeOptions(selectedSeries, selectedSeason)
        : [];

    // Event handlers using store
    const handleCategoryChange = (category: string | number | null) => {
        if (typeof category === 'string') {
            console.log('🔄 Category change handler called with:', category);

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
            {/* Header */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 2,
                    borderBottom: '1px solid rgba(255, 255, 240, 0.1)',
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IoFilterOutline size={20} color="var(--dark-pink)" />
                    <Typography
                        variant="h6"
                        sx={{
                            color: '#FFFFF0',
                            fontWeight: 600,
                            fontFamily: "'Bitcount Prop Single', sans-serif"
                        }}
                    >
                        Filters
                    </Typography>
                </Box>
                <IconButton
                    onClick={onClose}
                    sx={{
                        color: 'rgba(255, 255, 240, 0.7)',
                        '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.08)',
                            color: '#FFFFF0'
                        }
                    }}
                >
                    <IoClose size={20} />
                </IconButton>
            </Box>

            {/* Filter Controls */}
            <Box sx={{ p: 3, flex: 1 }}>
                <Stack spacing={4}>
                    {/* Category Filter */}
                    <Box>
                        <Typography
                            variant="subtitle2"
                            sx={{
                                mb: 2,
                                color: 'var(--dark-pink)',
                                fontWeight: 600,
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}
                        >
                            Category
                        </Typography>
                        <SplitButton
                            label="Category"
                            selectedValue={seriesCategory}
                            options={categoryOptions}
                            onSelect={handleCategoryChange}
                            placeholder="Select Category"
                        />
                    </Box>

                    <Divider sx={{ borderColor: 'rgba(255, 255, 240, 0.1)' }} />

                    {/* Series Filter */}
                    <Box>
                        <Typography
                            variant="subtitle2"
                            sx={{
                                mb: 2,
                                color: 'var(--dark-pink)',
                                fontWeight: 600,
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}
                        >
                            Series
                        </Typography>
                        <SplitButton
                            label="Series"
                            selectedValue={selectedSeries}
                            options={seriesOptions}
                            onSelect={handleSeriesChange}
                            placeholder={`${seriesCategory === "main-series" ? "RuPaul's Drag Race" : "Select Series"}`}
                            seriesCategory={seriesCategory || undefined}
                        />
                    </Box>

                    <Divider sx={{ borderColor: 'rgba(255, 255, 240, 0.1)' }} />

                    {/* Season Filter */}
                    <Box>
                        <Typography
                            variant="subtitle2"
                            sx={{
                                mb: 2,
                                color: 'var(--dark-pink)',
                                fontWeight: 600,
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}
                        >
                            Season
                        </Typography>
                        <SplitButton
                            label="Season"
                            selectedValue={selectedSeason}
                            options={seasonOptions}
                            onSelect={handleSeasonChange}
                            allowClear={true}
                            clearLabel="All Seasons"
                            placeholder="Select Season"
                        />
                    </Box>

                    <Divider sx={{ borderColor: 'rgba(255, 255, 240, 0.1)' }} />

                    {/* Episode Filter */}
                    <Box>
                        <Typography
                            variant="subtitle2"
                            sx={{
                                mb: 2,
                                color: 'var(--dark-pink)',
                                fontWeight: 600,
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}
                        >
                            Episode
                        </Typography>
                        <SplitButton
                            label="Episode"
                            selectedValue={selectedEpisode}
                            options={episodeOptions}
                            onSelect={handleEpisodeChange}
                            allowClear={true}
                            clearLabel="All Episodes"
                            placeholder="Select Episode"
                        />
                    </Box>
                </Stack>
            </Box>

            {/* Action Buttons */}
            <Box
                sx={{
                    p: 3,
                    borderTop: '1px solid rgba(255, 255, 240, 0.1)',
                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                }}
            >
                <Stack spacing={2}>
                    {/* Apply Filters Button */}
                    <Button
                        onClick={handleApplyFilters}
                        disabled={!seriesCategory}
                        variant="contained"
                        fullWidth
                        sx={{
                            py: 1.5,
                            backgroundColor: seriesCategory ? 'var(--dark-pink)' : 'rgba(128, 128, 128, 0.3)',
                            color: '#FFFFF0',
                            fontWeight: 600,
                            textTransform: 'none',
                            fontSize: '1rem',
                            borderRadius: 2,
                            '&:hover': {
                                backgroundColor: seriesCategory ? 'hsl(327, 81%, 50%)' : 'rgba(128, 128, 128, 0.3)',
                            },
                            '&:disabled': {
                                color: 'rgba(255, 255, 240, 0.3)',
                            }
                        }}
                    >
                        Apply Filters
                    </Button>

                    {/* Clear Filters Button */}
                    <Button
                        onClick={handleClearFilters}
                        variant="outlined"
                        fullWidth
                        startIcon={<MdClear />}
                        sx={{
                            py: 1.5,
                            borderColor: 'rgba(255, 255, 240, 0.3)',
                            color: 'rgba(255, 255, 240, 0.7)',
                            fontWeight: 500,
                            textTransform: 'none',
                            fontSize: '0.95rem',
                            borderRadius: 2,
                            '&:hover': {
                                borderColor: 'rgba(255, 255, 240, 0.5)',
                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                color: '#FFFFF0',
                            }
                        }}
                    >
                        Clear All Filters
                    </Button>
                </Stack>

                {/* Filter Status */}
                {hasActiveFilters() && (
                    <Typography
                        variant="caption"
                        sx={{
                            mt: 2,
                            display: 'block',
                            textAlign: 'center',
                            color: 'var(--dark-pink)',
                            fontStyle: 'italic'
                        }}
                    >
                        Active filters applied
                    </Typography>
                )}
            </Box>
        </Box>
    );

    return (
        <Drawer
            anchor="left"
            open={open}
            onClose={onClose}
            variant="temporary"
            sx={{
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    backgroundColor: 'var(--rich-charcoal)',
                    border: 'none',
                    boxShadow: '4px 0 20px rgba(0, 0, 0, 0.3)',
                },
                '& .MuiBackdrop-root': {
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                }
            }}
        >
            {drawerContent}
        </Drawer>
    );
}