'use client'

import { Box, Stack } from '@mui/material';
import SplitButton from './SplitButton';
import { useSeriesFiltering } from '../../../lib/hooks';
import { FilterControlsProps } from '../../../lib/definitions';

export default function FilterControls({
    seriesCategory,
    selectedSeries,
    selectedSeason,
    selectedEpisode,
    onCategoryChange,
    onSeriesChange,
    onSeasonChange,
    onEpisodeChange,
}: FilterControlsProps) {
    const {
        getSeriesByCategory,
        getSeasonOptions,
        getEpisodeOptions,
    } = useSeriesFiltering();

    // Prepare options for each filter
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

    return (
        <Box sx={{ p: 3, flex: 1 }}>
            <Stack spacing={4}>
                {/* Category Filter */}
                <Box>
                    <SplitButton
                        label="Category"
                        selectedValue={seriesCategory}
                        options={categoryOptions}
                        onSelect={onCategoryChange}
                        placeholder="Select Category"
                    />
                </Box>

                {/* Series Filter */}
                <Box>
                    <SplitButton
                        label="Series"
                        selectedValue={selectedSeries}
                        options={seriesOptions}
                        onSelect={onSeriesChange}
                        placeholder={`${seriesCategory === "main-series" ? "RuPaul's Drag Race" : "Select Series"}`}
                        seriesCategory={seriesCategory || undefined}
                    />
                </Box>

                {/* Season Filter */}
                <Box>
                    <SplitButton
                        label="Season"
                        selectedValue={selectedSeason}
                        options={seasonOptions}
                        onSelect={onSeasonChange}
                        allowClear={true}
                        clearLabel="All Seasons"
                        placeholder="Select Season"
                    />
                </Box>

                {/* Episode Filter */}
                <Box>
                    <SplitButton
                        label="Episode"
                        selectedValue={selectedEpisode}
                        options={episodeOptions}
                        onSelect={onEpisodeChange}
                        allowClear={true}
                        clearLabel="All Episodes"
                        placeholder="Select Episode"
                    />
                </Box>
            </Stack>
        </Box>
    );
}