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
                backgroundColor: 'rgba(238, 91, 172, 0.15)',
                color: '#EE5BAC',
                border: '1px solid rgba(238, 91, 172, 0.3)',
                '& .MuiChip-deleteIcon': {
                    color: '#EE5BAC',
                    '&:hover': {
                        color: '#EE5BAC',
                        opacity: 0.8
                    }
                }
            }}
        />
    );
}