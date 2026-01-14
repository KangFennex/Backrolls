"use client";

import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/hooks';

// Menu Icons
import { RiCloseLargeFill } from "react-icons/ri";
import { BsCupHot, BsCupHotFill } from "react-icons/bs";
import { RiSofaLine, RiSofaFill } from "react-icons/ri";
import { FaPlus } from 'react-icons/fa';
import { TbHomeSpark } from "react-icons/tb";
import { FaFire } from "react-icons/fa6";
import { FaRegClock } from "react-icons/fa";
import { FaRegCommentDots } from "react-icons/fa";
import { FiLogIn, FiLogOut } from "react-icons/fi";
import { FaRegQuestionCircle } from "react-icons/fa";

interface SidePanelProps {
    open: boolean;
    onClose: () => void;
    anchor?: 'left' | 'right';
}

const panelLinks = [
    { label: 'WorkRoom', href: '/', icon: <TbHomeSpark /> },
    { label: 'Hot Backrolls', href: '/hot', icon: <FaFire /> },
    { label: 'Fresh Backrolls', href: '/fresh', icon: <FaRegClock /> },
    { label: 'Guess', href: '/guess', icon: <FaRegQuestionCircle /> },
    { label: 'Have a kiki', href: '/kiki', icon: <FaRegCommentDots /> },
    { label: 'Tea Room', href: '/tea-room', icon: <BsCupHot /> },
    { label: 'Lounge', href: '/lounge', icon: <RiSofaLine /> },
    { label: 'Submit Backroll', href: '/submit', icon: <FaPlus /> },
]

export default function SidePanel({ open, onClose, anchor = 'left' }: SidePanelProps) {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        await signOut({ redirect: false });
        onClose();
        router.push('/');
        router.refresh();
    };

    const handleLogin = () => {
        onClose();
        router.push('/login');
    };

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
            <Box sx={{ flex: 1, overflowY: 'hidden' }}>
                <List>
                    {panelLinks.map(({ label, href, icon }) => (
                        <Box key={label}>
                            {/* Divider before Lounge */}
                            {label === 'Lounge' && (
                                <Box sx={{
                                    width: '80%',
                                    height: '1px',
                                    my: 2,
                                    mx: 'auto',
                                    background: 'linear-gradient(to right, transparent, rgba(255, 255, 255, 0.15) 50%, transparent)',
                                }} />
                            )}
                            <Link href={href} onClick={onClose} className="no-underline">
                                <ListItemButton sx={{ borderRadius: 1, mx: 1, mb: 0.5, transition: 'background-color 0.3s', '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' } }}>
                                    {icon && <Box sx={{ mr: 2 }}>{icon}</Box>}
                                    <ListItemText primary={label} />
                                </ListItemButton>
                            </Link>
                        </Box>
                    ))}
                </List>
            </Box>

            {/* Auth Button at Bottom */}
            <Box sx={{
                p: 2,
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                mt: 'auto'
            }}>
                {!isLoading && (
                    isAuthenticated ? (
                        <Button
                            fullWidth
                            onClick={handleLogout}
                            startIcon={<FiLogOut />}
                            sx={{
                                bgcolor: 'rgba(238, 91, 172, 0.15)',
                                color: '#EE5BAC',
                                border: '1px solid rgba(238, 91, 172, 0.3)',
                                borderRadius: '12px',
                                py: 1.5,
                                textTransform: 'none',
                                fontSize: '1rem',
                                fontWeight: 600,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    bgcolor: 'rgba(238, 91, 172, 0.25)',
                                    borderColor: 'rgba(238, 91, 172, 0.5)',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 4px 12px rgba(238, 91, 172, 0.2)',
                                }
                            }}
                        >
                            Logout
                        </Button>
                    ) : (
                        <Button
                            fullWidth
                            onClick={handleLogin}
                            startIcon={<FiLogIn />}
                            sx={{
                                background: 'linear-gradient(135deg, rgba(238, 91, 172, 0.9) 0%, rgba(233, 144, 193, 0.9) 100%)',
                                color: 'white',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                borderRadius: '12px',
                                py: 1.5,
                                textTransform: 'none',
                                fontSize: '1rem',
                                fontWeight: 600,
                                transition: 'all 0.3s ease',
                                boxShadow: '0 4px 12px rgba(238, 91, 172, 0.3)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, rgba(238, 91, 172, 1) 0%, rgba(233, 144, 193, 1) 100%)',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 6px 16px rgba(238, 91, 172, 0.4)',
                                }
                            }}
                        >
                            Login
                        </Button>
                    )
                )}
            </Box>

        </Drawer >
    );
}
