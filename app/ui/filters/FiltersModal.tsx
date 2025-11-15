'use client'

import { Suspense } from 'react';
import { Dialog } from '@mui/material';
import FiltersModalContent from './FiltersModalContent';
import { useFiltersContext } from '../../context/FiltersModalContext';

export default function FiltersModal() {
    const { isFiltersModalVisible, toggleFilters } = useFiltersContext();

    return (
        <Suspense fallback={<div>Loading filters</div>}>
            <Dialog
                open={isFiltersModalVisible}
                onClose={toggleFilters}
                fullWidth
                maxWidth="sm"
                sx={{
                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                    '& .MuiPaper-root': {
                        backgroundColor: 'var(--rich-charcoal)',
                        opacity: 0.99,
                        borderRadius: 2,
                        padding: 1,
                    },
                }}
            >
                <FiltersModalContent />
            </Dialog>
        </Suspense>
    );
}
