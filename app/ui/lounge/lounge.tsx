'use client'

import { useState, useEffect } from 'react';
import { useAuth } from '../../lib/hooks';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { westernZodiacSigns, chineseZodiacSigns } from '../../lib/repertoire';
import { PhotoCamera, Edit } from '@mui/icons-material';
import { RenderFavorites } from './components/favorites';
import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Avatar,
    IconButton
} from '@mui/material';

export default function Lounge() {
    const { user, isLoading, isAuthenticated } = useAuth();
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        username: user?.username || '',
        catchPhrase: '',
        zodiacSign: '',
        FavSeason: '',
        FavQueen: '',
        aboutMe: '',
        links: '',
        numbers: ''
    });

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isLoading, isAuthenticated, router]);

    const handleLogout = async () => {
        try {
            // Use NextAuth signOut
            await signOut({ callbackUrl: '/' });
        } catch (error) {
            console.error('Logout failed:', error);
            // Fallback: redirect to login
            router.push('/login');
        }
    };

    if (isLoading) {
        return <Typography>Loading...</Typography>;
    }
    const handleInputChange = (field: string, value: string) => {
        setProfileData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return (
        <div className="flex flex-col item-center min-h-screen min-w-full px-10">
            <Box sx={{
                display: 'grid',
                gridTemplateColumns: { md: '1fr 250px' },
                gap: { md: 3 },
                padding: 0,
                mx: 'auto',
                minWidth: { sm: 'auto', md: '100%' },
            }}>

                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    order: { xs: 2, md: 1 }
                }}>
                    {/* Saved Backrolls */}
                    <Card sx={{
                        bgcolor: '#b8e6d2',
                        borderRadius: 3,
                        border: '2px solid #ccc',
                        boxShadow: '8px 8px 8px rgba(0, 0, 0, 0.5)',
                    }}>
                        <CardContent>
                            <RenderFavorites />
                        </CardContent>
                    </Card>

                    {/* Links and Numbers Row */}
                    <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                        <Box sx={{ flex: 1 }}>
                            <Card sx={{
                                bgcolor: '#e6b8d6',
                                height: '100%',
                                borderRadius: 3,
                                border: '2px solid #ccc',
                                boxShadow: '8px 8px 8px rgba(0, 0, 0, 0.5)',
                        }}>
                            <CardContent>
                            </CardContent>
                        </Card>
                    </Box>

                    <Box sx={{ flex: 1 }}>
                        <Card sx={{
                            bgcolor: '#f0e6d2',
                            height: '100%',
                            borderRadius: 3,
                            border: '2px solid #ccc',
                            boxShadow: '8px 8px 8px rgba(0, 0, 0, 0.5)',
                        }}>
                            <CardContent>
                            </CardContent>
                        </Card>
                    </Box>
                </Box>
                </Box>

                {/* Avatar, Auth Info & Additional Info Section */}
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    gap: 2,
                    boxShadow: { md: '8px 8px 8px rgba(0, 0, 0, 0.5)' },
                    order: { xs: 1, md: 2 }
                }}>

                    {/* Avatar Section */}
                    <Card sx={{
                        width: '100%',
                        height: '50%',
                        borderRadius: 3,
                        border: '2px solid #ccc',
                        boxShadow: '8px 8px 8px rgba(0, 0, 0, 0.5)',
                    }}>
                        <CardContent>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                height: '100%',
                                justifyContent: 'center'
                            }}>
                                <Box sx={{
                                    position: 'relative',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    height: 'auto',
                                    justifyContent: 'center'
                                }}>
                                    <Avatar
                                        sx={{
                                            width: { xs: 100, md: 120 },
                                            height: { xs: 100, md: 120 },
                                            bgcolor: '#d4a574'
                                        }}
                                        src="/path-to-profile-image.jpg"
                                    />
                                    <IconButton
                                        sx={{
                                            position: 'absolute',
                                            bottom: 0,
                                            right: 0,
                                            bgcolor: 'background.paper',
                                            '&:hover': { bgcolor: 'grey.100' }
                                        }}
                                        size="small"
                                    >
                                        <PhotoCamera fontSize="small" />
                                    </IconButton>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>

                    {/* Auth Info Card */}
                    <Card sx={{
                        width: '100%',
                        height: '50%',
                        borderRadius: 3,
                        bgcolor: '#e6b8d6',
                        border: '2px solid #ccc',
                        boxShadow: '8px 8px 8px rgba(0, 0, 0, 0.5)',
                    }}>
                        <CardContent>
                            <TextField
                                fullWidth
                                label="Username"
                                value={user?.username || ''}
                                onChange={(e) => handleInputChange('username', e.target.value)}
                                disabled={!isEditing}
                                sx={{ mb: 2 }}
                                variant="standard"
                                size="small"
                            />
                            <TextField
                                fullWidth
                                label="Email"
                                value={user?.email || ''}
                                disabled
                                sx={{ mb: 2 }}
                                variant="standard"
                                size="small"
                            />
                            <TextField
                                fullWidth
                                label="Password"
                                value={'********'}
                                disabled={!isEditing}
                                sx={{ mb: 2 }}
                                variant="standard"
                                size="small"
                            />
                        </CardContent>
                    </Card>
                    {/* My Info Card */}
                    <Card sx={{
                        bgcolor: '#f5f3b8',
                        width: '100%',
                        height: '100%',
                        borderRadius: 3,
                        border: '2px solid #ccc',
                    }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h6" component="h2">
                                    My Info
                                </Typography>
                                <IconButton onClick={() => setIsEditing(!isEditing)} size="small">
                                    <Edit />
                                </IconButton>
                            </Box>

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                                <TextField
                                    fullWidth
                                    label="Catch Phrase"
                                    value={profileData.catchPhrase}
                                    onChange={(e) => handleInputChange('catchPhrase', e.target.value)}
                                    disabled={!isEditing}
                                    sx={{ mb: 2 }}
                                    variant="standard"
                                    size="small"
                                />
                                <FormControl sx={{ flex: 1 }} size="small" disabled={!isEditing}>
                                    <InputLabel>Zodiac Sign</InputLabel>
                                    <Select
                                        value={profileData.zodiacSign}
                                        onChange={(e) => handleInputChange('zodiacSign', e.target.value)}
                                        label="Zodiac Sign"
                                        variant="standard"
                                    >
                                        <MenuItem value="">
                                            <em>Select zodiac sign</em>
                                        </MenuItem>

                                        {/* Western Zodiac Section */}
                                        <MenuItem disabled sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                                            Western Zodiac
                                        </MenuItem>
                                        {westernZodiacSigns.map((sign) => (
                                            <MenuItem key={`western-${sign}`} value={`${sign} (Western)`}>
                                                {sign}
                                            </MenuItem>
                                        ))}

                                        {/* Divider */}
                                        <MenuItem disabled>
                                            ─────────────
                                        </MenuItem>

                                        {/* Chinese Zodiac Section */}
                                        <MenuItem disabled sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                                            Chinese Zodiac
                                        </MenuItem>
                                        {chineseZodiacSigns.map((sign) => (
                                            <MenuItem key={`chinese-${sign}`} value={`${sign} (Chinese)`}>
                                                {sign}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <TextField
                                    label="Favorite Season"
                                    value={profileData.FavSeason}
                                    onChange={(e) => handleInputChange('FavSeason', e.target.value)}
                                    disabled={!isEditing}
                                    variant="standard"
                                    size="small"
                                    sx={{ flex: 1 }}
                                />
                                <TextField
                                    label="Favorite Queen"
                                    value={profileData.FavQueen}
                                    onChange={(e) => handleInputChange('FavQueen', e.target.value)}
                                    disabled={!isEditing}
                                    variant="standard"
                                    size="small"
                                    sx={{ flex: 1 }}
                                />
                            </Box>
                        </CardContent>
                    </Card>
                    {/* Save/Cancel Buttons */}
                    {isEditing && (
                        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
                            <Button
                                variant="contained"
                                onClick={() => {
                                    // Add save logic here
                                    setIsEditing(false);
                                }}
                            >
                                Save Changes
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={() => setIsEditing(false)}
                            >
                                Cancel
                            </Button>
                        </Box>
                    )}
                    {/* Logout Button */}
                    <Button variant="contained" sx={{ width: '100px' }} onClick={handleLogout}>Logout</Button>
                </Box>
            </Box>
        </div >
    );
}