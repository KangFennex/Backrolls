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
                BackdropProps={{
                    sx: { backgroundColor: 'rgba(0, 0, 0, 0.35)' }
                }}
                PaperProps={{
                    sx: {
                        background: 'rgba(30, 30, 40, 0.95)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(0, 0, 0, 0.05)',
                        padding: 0,
                    }
                }}
            >
                <FiltersModalContent />
            </Dialog>
        </Suspense>
    );
}
