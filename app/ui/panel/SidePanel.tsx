"use client";

import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// Menu Icons
import { RiCloseLargeFill } from "react-icons/ri";
import { BsCupHot, BsCupHotFill } from "react-icons/bs";
import { RiSofaLine, RiSofaFill } from "react-icons/ri";
import { FaPlus } from 'react-icons/fa';
import { TbHomeSpark } from "react-icons/tb";
import { FaFire } from "react-icons/fa6";
import { FaRegClock } from "react-icons/fa";
import { FaRegCommentDots } from "react-icons/fa";

interface SidePanelProps {
    open: boolean;
    onClose: () => void;
    anchor?: 'left' | 'right';
}

const panelLinks = [
    { label: 'WorkRoom', href: '/', icon: <TbHomeSpark /> },
    { label: 'Hot Backrolls', href: '/hot', icon: <FaFire /> },
    { label: 'Fresh Backrolls', href: '/fresh', icon: <FaRegClock /> },
    { label: 'Have a kiki', href: '/kiki', icon: <FaRegCommentDots /> },
    { label: 'Tea Room', href: '/tea-room', icon: <BsCupHot /> },
    { label: 'Lounge', href: '/lounge', icon: <RiSofaLine /> },
    { label: 'Submit Backroll', href: '/submit', icon: <FaPlus /> },
]

export default function SidePanel({ open, onClose, anchor = 'left' }: SidePanelProps) {
    return (
        <Drawer
            anchor={anchor}
            open={open}
            onClose={onClose}
            ModalProps={{ keepMounted: true }}
            BackdropProps={{ sx: { backgroundColor: 'rgba(0,0,0,0.35)' } }}
            PaperProps={{
                sx: {
                    width: { xs: 200, sm: 240 },
                    height: '100%',
                    bgcolor: '#1A1A1A', // gray-800 dark background
                    color: 'white',
                    display: 'flex',
                    flexDirection: 'column',
                }
            }}
        >
            {/* Panel Header */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 2, py: 2 }}>
                <IconButton aria-label="Close panel" onClick={onClose} size="small" sx={{ color: 'white' }}>
                    <RiCloseLargeFill className="pink-fill hover:scale-110 transition-transform duration-300" />
                </IconButton>
            </Box>

            {/* Panel Links */}
            <Box sx={{ flex: 1, overflowY: 'auto' }}>
                <List>
                    {panelLinks.map(({ label, href, icon }) => (
                        <Link key={label} href={href} onClick={onClose} className="no-underline">
                            <ListItemButton sx={{ borderRadius: 1, mx: 1, mb: 0.5, transition: 'background-color 0.3s', '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' } }}>
                                {icon && <Box sx={{ mr: 2 }}>{icon}</Box>}
                                <ListItemText primary={label} />
                            </ListItemButton>
                        </Link>
                    ))}
                </List>
            </Box>

        </Drawer >
    );
}
