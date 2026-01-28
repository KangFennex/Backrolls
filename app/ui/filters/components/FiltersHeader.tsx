'use client'

import { Box, IconButton } from '@mui/material';
import { IoClose } from "react-icons/io5";
import { FiltersHeaderProps } from '../../../lib/definitions';
import { BackrollsLogo } from '../../shared/BackrollsLogo';

export default function FiltersHeader({ onClose }: FiltersHeaderProps) {
    const handleClose = () => onClose();
    return (
        <Box sx={{ 
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
            width: '100%',
            p: 0
        }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                <BackrollsLogo />
            </Box>
            <IconButton
                onClick={handleClose}
                sx={{
                    position: 'absolute',
                    right: 0,
                    color: 'var(--dark-pink)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        backgroundColor: 'rgba(238, 91, 172, 0.1)',
                        transform: 'scale(1.1)',
                    }
                }}
            >
                <IoClose size={28} />
            </IconButton>
        </Box>
    );
}