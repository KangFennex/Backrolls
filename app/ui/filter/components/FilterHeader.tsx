'use client'

import { Box, IconButton } from '@mui/material';
import { IoClose, IoFilterOutline } from "react-icons/io5";
import { FilterHeaderProps } from '../../../lib/definitions';

export default function FilterHeader({ onClose }: FilterHeaderProps) {
    return (
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
    );
}