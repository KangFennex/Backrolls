'use client'

import { Box, Stack, Typography } from '@mui/material';
import FilterChip from './FiltersChip';
import { codeEquivalence } from '../../../lib/newRepertoire';

interface ActiveFiltersChipsProps {
    selectedRegion: string;
    selectedSeriesCode: string | null;
    selectedSeason: number | null;
    selectedEpisode: number | null;
    onRemoveFilter: (filterType: string) => void;
}

export default function ActiveFiltersChips({
    selectedRegion,
    selectedSeriesCode,
    selectedSeason,
    selectedEpisode,
    onRemoveFilter
}: ActiveFiltersChipsProps) {
    const seriesName = selectedSeriesCode ? codeEquivalence[selectedSeriesCode] : null;

    return (
        <Box sx={{ mb: 3, mt: 1 }}>
            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 240, 0.7)', mb: 1, display: 'block' }}>
                Active Filters:
            </Typography>
            <Stack direction="row" flexWrap="wrap" gap={1}>
                {selectedRegion && (
                    <FilterChip
                        label={`${selectedRegion.charAt(0).toUpperCase() + selectedRegion.slice(1)}`}
                        onDelete={() => onRemoveFilter('region')}
                    />
                )}
                {selectedSeriesCode && (
                    <FilterChip
                        label={`${seriesName || selectedSeriesCode}`}
                        onDelete={() => onRemoveFilter('series')}
                    />
                )}
                {selectedSeason && (
                    <FilterChip
                        label={`Season: ${selectedSeason}`}
                        onDelete={() => onRemoveFilter('season')}
                    />
                )}
                {selectedEpisode && (
                    <FilterChip
                        label={`Episode: ${selectedEpisode}`}
                        onDelete={() => onRemoveFilter('episode')}
                    />
                )}
            </Stack>
        </Box>
    );
}
