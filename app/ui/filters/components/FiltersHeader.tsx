'use client'

import { Box, IconButton } from '@mui/material';
import { IoClose } from "react-icons/io5";
import { FiltersHeaderProps } from '../../../lib/definitions';
import { BackrollsLogo } from '../../sharedComponents';

export default function FiltersHeader({ onClose }: FiltersHeaderProps) {
    return (
        <Box
            sx={{
                display: 'flex',
                p: 0,
                width: '100%',
                position: 'relative',
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                <BackrollsLogo />
            </div>
            <IconButton
                onClick={onClose}
                sx={{
                    color: 'var(--dark-pink)',
                    position: 'absolute',
                    right: 0,
                    marginLeft: 'auto',
                    '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.08)',
                        scale: 1.1,
                        transition: 'scale 0.3s',
                    }
                }}
            >
                <IoClose size={28} />
            </IconButton>
        </Box>
    );
}