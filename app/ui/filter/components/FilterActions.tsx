'use client'

import { Box, Button, Stack, Typography } from '@mui/material';
import { MdClear } from "react-icons/md";
import { FilterActionsProps } from '../../../lib/definitions';

export default function FilterActions({
    seriesCategory,
    hasActiveFilters,
    onApplyFilters,
    onClearFilters,
}: FilterActionsProps) {
    return (
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
                    onClick={onApplyFilters}
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
                    onClick={onClearFilters}
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
            {hasActiveFilters && (
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
    );
}