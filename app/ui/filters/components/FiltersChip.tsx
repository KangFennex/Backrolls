'use client'

import { Chip } from '@mui/material';

interface FilterChipProps {
    label: string;
    onDelete: () => void;
}

export default function FilterChip({ label, onDelete }: FilterChipProps) {
    return (
        <Chip
            label={label}
            onDelete={onDelete}
            sx={{
                backgroundColor: 'var(--dark-pink)',
                color: '#FFFFF0',
                '& .MuiChip-deleteIcon': {
                    color: 'rgba(255, 255, 240, 0.7)',
                    '&:hover': { color: '#FFFFF0' }
                }
            }}
        />
    );
}