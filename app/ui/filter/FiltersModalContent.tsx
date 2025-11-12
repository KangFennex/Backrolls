'use client'

import { useState, useMemo } from 'react';
import {
    Box,
    Button,
    DialogActions,
    DialogContent,
    DialogTitle,
    Autocomplete,
    TextField,
    Chip,
    Stack,
    Paper,
    MenuItem,
    MenuList,
    Typography,
    Popper,
    ClickAwayListener
} from '@mui/material';
import FilterHeader from './components/FilterHeader';
import { useFilterContext } from '../../context/FilterContext';

// Placeholder data structure
interface Contestant {
    name: string;
    franchise: string;
    series: string;
    season: number;
    episode: number;
}

const PLACEHOLDER_DATA = {
    franchises: [
        { id: 'rpdr', label: "RuPaul's Drag Race" },
        { id: 'cdr', label: "Canada's Drag Race" }
    ],
    series: [
        { id: 'main-series', label: 'Main Series' },
        { id: 'all-stars', label: 'All Stars' }
    ],
    contestants: [
        // RuPaul's Drag Race - Main Series
        { name: 'Akashia', franchise: 'rpdr', series: 'main-series', season: 1, episode: 1 },
        { name: 'Chanel', franchise: 'rpdr', series: 'main-series', season: 1, episode: 1 },
        { name: 'Rave', franchise: 'rpdr', series: 'main-series', season: 1, episode: 2 },
        { name: 'Jujube', franchise: 'rpdr', series: 'main-series', season: 1, episode: 2 },
        // RuPaul's Drag Race - All Stars
        { name: 'Tammie Brown', franchise: 'rpdr', series: 'all-stars', season: 1, episode: 1 },
        { name: 'Nina Flowers', franchise: 'rpdr', series: 'all-stars', season: 1, episode: 1 },
        { name: 'Alaska Thunderfuck', franchise: 'rpdr', series: 'all-stars', season: 1, episode: 2 },
        { name: 'Katya', franchise: 'rpdr', series: 'all-stars', season: 1, episode: 2 },
        // Canada's Drag Race - Main Series
        { name: 'Priyanka', franchise: 'cdr', series: 'main-series', season: 1, episode: 1 },
        { name: 'Jimbo', franchise: 'cdr', series: 'main-series', season: 1, episode: 1 },
        { name: 'Suki Doll', franchise: 'cdr', series: 'main-series', season: 2, episode: 2 },
        { name: 'Icesis Couture', franchise: 'cdr', series: 'main-series', season: 2, episode: 2 }
    ] as Contestant[]
};

export default function FiltersModalContent() {
    const { toggleFilters } = useFilterContext();

    // Filter state
    const [selectedFranchise, setSelectedFranchise] = useState<string | null>(null);
    const [selectedSeries, setSelectedSeries] = useState<string | null>(null);
    const [selectedSeason, setSelectedSeason] = useState<number | null>(null);
    const [selectedEpisode, setSelectedEpisode] = useState<number | null>(null);
    const [selectedContestant, setSelectedContestant] = useState<string | null>(null);

    // Popper state for hover menu
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [menuType, setMenuType] = useState<'franchise' | 'series' | null>(null);

    // Calculate available options based on current selections
    const availableSeasons = useMemo(() => {
        if (!selectedFranchise || !selectedSeries) return [];
        const seasons = new Set(
            PLACEHOLDER_DATA.contestants
                .filter(c => c.franchise === selectedFranchise && c.series === selectedSeries)
                .map(c => c.season)
        );
        return Array.from(seasons).sort((a, b) => a - b);
    }, [selectedFranchise, selectedSeries]);

    const availableEpisodes = useMemo(() => {
        if (!selectedFranchise || !selectedSeries || !selectedSeason) return [];
        const episodes = new Set(
            PLACEHOLDER_DATA.contestants
                .filter(c =>
                    c.franchise === selectedFranchise &&
                    c.series === selectedSeries &&
                    c.season === selectedSeason
                )
                .map(c => c.episode)
        );
        return Array.from(episodes).sort((a, b) => a - b);
    }, [selectedFranchise, selectedSeries, selectedSeason]);

    const availableContestants = useMemo(() => {
        let filtered = PLACEHOLDER_DATA.contestants;

        if (selectedFranchise) {
            filtered = filtered.filter(c => c.franchise === selectedFranchise);
        }
        if (selectedSeries) {
            filtered = filtered.filter(c => c.series === selectedSeries);
        }
        if (selectedSeason) {
            filtered = filtered.filter(c => c.season === selectedSeason);
        }
        if (selectedEpisode) {
            filtered = filtered.filter(c => c.episode === selectedEpisode);
        }

        return filtered.map(c => c.name).sort();
    }, [selectedFranchise, selectedSeries, selectedSeason, selectedEpisode]);

    // Menu handlers
    const handleMouseEnter = (event: React.MouseEvent<HTMLElement>, type: 'franchise' | 'series') => {
        setAnchorEl(event.currentTarget);
        setMenuType(type);
    };

    const handleMouseLeave = () => {
        setAnchorEl(null);
        setMenuType(null);
    };

    const handleMenuItemClick = (type: string, value: string | number) => {
        if (type === 'franchise') {
            setSelectedFranchise(value as string);
            setSelectedSeries(null);
            setSelectedSeason(null);
            setSelectedEpisode(null);
        } else if (type === 'series') {
            setSelectedSeries(value as string);
            setSelectedSeason(null);
            setSelectedEpisode(null);
        } else if (type === 'season') {
            setSelectedSeason(value as number);
            setSelectedEpisode(null);
        } else if (type === 'episode') {
            setSelectedEpisode(value as number);
        } else if (type === 'contestant') {
            setSelectedContestant(value as string);
            // Auto-apply filters when contestant is selected from menu
            const contestant = PLACEHOLDER_DATA.contestants.find(c => c.name === value);
            if (contestant) {
                setSelectedFranchise(contestant.franchise);
                setSelectedSeries(contestant.series);
                setSelectedSeason(contestant.season);
                setSelectedEpisode(contestant.episode);
            }
        }
        handleMouseLeave();
    };

    // Chip removal handlers
    const removeFilter = (filterType: string) => {
        switch (filterType) {
            case 'franchise':
                setSelectedFranchise(null);
                setSelectedSeries(null);
                setSelectedSeason(null);
                setSelectedEpisode(null);
                setSelectedContestant(null);
                break;
            case 'series':
                setSelectedSeries(null);
                setSelectedSeason(null);
                setSelectedEpisode(null);
                break;
            case 'season':
                setSelectedSeason(null);
                setSelectedEpisode(null);
                break;
            case 'episode':
                setSelectedEpisode(null);
                break;
            case 'contestant':
                setSelectedContestant(null);
                break;
        }
    };

    const handleReset = () => {
        setSelectedFranchise(null);
        setSelectedSeries(null);
        setSelectedSeason(null);
        setSelectedEpisode(null);
        setSelectedContestant(null);
    };

    const handleApply = () => {
        console.log('Applying filters:', {
            franchise: selectedFranchise,
            series: selectedSeries,
            season: selectedSeason,
            episode: selectedEpisode,
            contestant: selectedContestant
        });
        toggleFilters();
    };

    const franchiseLabel = PLACEHOLDER_DATA.franchises.find(f => f.id === selectedFranchise)?.label;
    const seriesLabel = PLACEHOLDER_DATA.series.find(s => s.id === selectedSeries)?.label;

    return (
        <>
            <DialogTitle sx={{ pb: 1 }}>
                <FilterHeader onClose={toggleFilters} />
            </DialogTitle>
            <DialogContent sx={{ backgroundColor: 'var(--rich-charcoal)', minHeight: '400px' }}>
                {/* Active Filters Chips */}
                <Box sx={{ mb: 3, mt: 1 }}>
                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 240, 0.7)', mb: 1, display: 'block' }}>
                        Active Filters:
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                        {selectedFranchise && (
                            <Chip
                                label={`Franchise: ${franchiseLabel}`}
                                onDelete={() => removeFilter('franchise')}
                                sx={{
                                    backgroundColor: 'var(--dark-pink)',
                                    color: '#FFFFF0',
                                    '& .MuiChip-deleteIcon': {
                                        color: 'rgba(255, 255, 240, 0.7)',
                                        '&:hover': { color: '#FFFFF0' }
                                    }
                                }}
                            />
                        )}
                        {selectedSeries && (
                            <Chip
                                label={`Series: ${seriesLabel}`}
                                onDelete={() => removeFilter('series')}
                                sx={{
                                    backgroundColor: 'var(--dark-pink)',
                                    color: '#FFFFF0',
                                    '& .MuiChip-deleteIcon': {
                                        color: 'rgba(255, 255, 240, 0.7)',
                                        '&:hover': { color: '#FFFFF0' }
                                    }
                                }}
                            />
                        )}
                        {selectedSeason && (
                            <Chip
                                label={`Season: ${selectedSeason}`}
                                onDelete={() => removeFilter('season')}
                                sx={{
                                    backgroundColor: 'var(--dark-pink)',
                                    color: '#FFFFF0',
                                    '& .MuiChip-deleteIcon': {
                                        color: 'rgba(255, 255, 240, 0.7)',
                                        '&:hover': { color: '#FFFFF0' }
                                    }
                                }}
                            />
                        )}
                        {selectedEpisode && (
                            <Chip
                                label={`Episode: ${selectedEpisode}`}
                                onDelete={() => removeFilter('episode')}
                                sx={{
                                    backgroundColor: 'var(--dark-pink)',
                                    color: '#FFFFF0',
                                    '& .MuiChip-deleteIcon': {
                                        color: 'rgba(255, 255, 240, 0.7)',
                                        '&:hover': { color: '#FFFFF0' }
                                    }
                                }}
                            />
                        )}
                        {selectedContestant && (
                            <Chip
                                label={`Contestant: ${selectedContestant}`}
                                onDelete={() => removeFilter('contestant')}
                                sx={{
                                    backgroundColor: 'var(--dark-pink)',
                                    color: '#FFFFF0',
                                    '& .MuiChip-deleteIcon': {
                                        color: 'rgba(255, 255, 240, 0.7)',
                                        '&:hover': { color: '#FFFFF0' }
                                    }
                                }}
                            />
                        )}
                        {!selectedFranchise && !selectedSeries && !selectedSeason && !selectedEpisode && !selectedContestant && (
                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 240, 0.5)', fontStyle: 'italic' }}>
                                No filters applied
                            </Typography>
                        )}
                    </Stack>
                </Box>

                {/* Filter Controls */}
                <Stack spacing={3}>
                    {/* Franchise Autocomplete with Hover Menu */}
                    <Box>
                        <Autocomplete
                            options={PLACEHOLDER_DATA.franchises}
                            getOptionLabel={(option) => option.label}
                            value={PLACEHOLDER_DATA.franchises.find(f => f.id === selectedFranchise) || null}
                            onChange={(_, newValue) => {
                                setSelectedFranchise(newValue?.id || null);
                                setSelectedSeries(null);
                                setSelectedSeason(null);
                                setSelectedEpisode(null);
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Franchise"
                                    placeholder="Select franchise..."
                                    onMouseEnter={(e) => handleMouseEnter(e, 'franchise')}
                                    sx={{
                                        '& .MuiInputLabel-root': {
                                            color: 'rgba(255, 255, 240, 0.7)',
                                            '&.Mui-focused': { color: 'var(--dark-pink)' }
                                        },
                                        '& .MuiOutlinedInput-root': {
                                            color: '#FFFFF0',
                                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                            '& fieldset': { borderColor: 'rgba(255, 255, 240, 0.2)' },
                                            '&:hover fieldset': { borderColor: 'rgba(255, 255, 240, 0.4)' },
                                            '&.Mui-focused fieldset': { borderColor: 'var(--dark-pink)' }
                                        }
                                    }}
                                />
                            )}
                            PaperComponent={(props) => (
                                <Paper {...props} sx={{
                                    backgroundColor: 'var(--rich-charcoal)',
                                    border: '1px solid rgba(255, 255, 240, 0.1)',
                                    '& .MuiAutocomplete-option': {
                                        color: '#FFFFF0',
                                        '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.08)' },
                                        '&.Mui-focused': { backgroundColor: 'rgba(255, 255, 255, 0.12)' }
                                    }
                                }} />
                            )}
                        />
                    </Box>

                    {/* Series Autocomplete with Hover Menu */}
                    <Box>
                        <Autocomplete
                            options={PLACEHOLDER_DATA.series}
                            getOptionLabel={(option) => option.label}
                            value={PLACEHOLDER_DATA.series.find(s => s.id === selectedSeries) || null}
                            onChange={(_, newValue) => {
                                setSelectedSeries(newValue?.id || null);
                                setSelectedSeason(null);
                                setSelectedEpisode(null);
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Series"
                                    placeholder="Select series..."
                                    onMouseEnter={(e) => handleMouseEnter(e, 'series')}
                                    sx={{
                                        '& .MuiInputLabel-root': {
                                            color: 'rgba(255, 255, 240, 0.7)',
                                            '&.Mui-focused': { color: 'var(--dark-pink)' }
                                        },
                                        '& .MuiOutlinedInput-root': {
                                            color: '#FFFFF0',
                                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                            '& fieldset': { borderColor: 'rgba(255, 255, 240, 0.2)' },
                                            '&:hover fieldset': { borderColor: 'rgba(255, 255, 240, 0.4)' },
                                            '&.Mui-focused fieldset': { borderColor: 'var(--dark-pink)' }
                                        }
                                    }}
                                />
                            )}
                            PaperComponent={(props) => (
                                <Paper {...props} sx={{
                                    backgroundColor: 'var(--rich-charcoal)',
                                    border: '1px solid rgba(255, 255, 240, 0.1)',
                                    '& .MuiAutocomplete-option': {
                                        color: '#FFFFF0',
                                        '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.08)' },
                                        '&.Mui-focused': { backgroundColor: 'rgba(255, 255, 255, 0.12)' }
                                    }
                                }} />
                            )}
                        />
                    </Box>

                    {/* Season Select */}
                    <Box>
                        <Autocomplete
                            options={availableSeasons}
                            getOptionLabel={(option) => `Season ${option}`}
                            value={selectedSeason}
                            onChange={(_, newValue) => {
                                setSelectedSeason(newValue);
                                setSelectedEpisode(null);
                            }}
                            disabled={!selectedFranchise || !selectedSeries}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Season"
                                    placeholder={selectedFranchise && selectedSeries ? "Select season..." : "Select franchise & series first"}
                                    sx={{
                                        '& .MuiInputLabel-root': {
                                            color: 'rgba(255, 255, 240, 0.7)',
                                            '&.Mui-focused': { color: 'var(--dark-pink)' },
                                            '&.Mui-disabled': { color: 'rgba(255, 255, 240, 0.3)' }
                                        },
                                        '& .MuiOutlinedInput-root': {
                                            color: '#FFFFF0',
                                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                            '& fieldset': { borderColor: 'rgba(255, 255, 240, 0.2)' },
                                            '&:hover fieldset': { borderColor: 'rgba(255, 255, 240, 0.4)' },
                                            '&.Mui-focused fieldset': { borderColor: 'var(--dark-pink)' },
                                            '&.Mui-disabled': {
                                                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                                                color: 'rgba(255, 255, 240, 0.3)'
                                            }
                                        }
                                    }}
                                />
                            )}
                            PaperComponent={(props) => (
                                <Paper {...props} sx={{
                                    backgroundColor: 'var(--rich-charcoal)',
                                    border: '1px solid rgba(255, 255, 240, 0.1)',
                                    '& .MuiAutocomplete-option': {
                                        color: '#FFFFF0',
                                        '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.08)' },
                                        '&.Mui-focused': { backgroundColor: 'rgba(255, 255, 255, 0.12)' }
                                    }
                                }} />
                            )}
                        />
                    </Box>

                    {/* Episode Select */}
                    <Box>
                        <Autocomplete
                            options={availableEpisodes}
                            getOptionLabel={(option) => `Episode ${option}`}
                            value={selectedEpisode}
                            onChange={(_, newValue) => setSelectedEpisode(newValue)}
                            disabled={!selectedSeason}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Episode"
                                    placeholder={selectedSeason ? "Select episode..." : "Select season first"}
                                    sx={{
                                        '& .MuiInputLabel-root': {
                                            color: 'rgba(255, 255, 240, 0.7)',
                                            '&.Mui-focused': { color: 'var(--dark-pink)' },
                                            '&.Mui-disabled': { color: 'rgba(255, 255, 240, 0.3)' }
                                        },
                                        '& .MuiOutlinedInput-root': {
                                            color: '#FFFFF0',
                                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                            '& fieldset': { borderColor: 'rgba(255, 255, 240, 0.2)' },
                                            '&:hover fieldset': { borderColor: 'rgba(255, 255, 240, 0.4)' },
                                            '&.Mui-focused fieldset': { borderColor: 'var(--dark-pink)' },
                                            '&.Mui-disabled': {
                                                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                                                color: 'rgba(255, 255, 240, 0.3)'
                                            }
                                        }
                                    }}
                                />
                            )}
                            PaperComponent={(props) => (
                                <Paper {...props} sx={{
                                    backgroundColor: 'var(--rich-charcoal)',
                                    border: '1px solid rgba(255, 255, 240, 0.1)',
                                    '& .MuiAutocomplete-option': {
                                        color: '#FFFFF0',
                                        '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.08)' },
                                        '&.Mui-focused': { backgroundColor: 'rgba(255, 255, 255, 0.12)' }
                                    }
                                }} />
                            )}
                        />
                    </Box>

                    {/* Contestant Autocomplete */}
                    <Box>
                        <Autocomplete
                            options={availableContestants}
                            value={selectedContestant}
                            onChange={(_, newValue) => setSelectedContestant(newValue)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Contestant"
                                    placeholder="Search contestant..."
                                    sx={{
                                        '& .MuiInputLabel-root': {
                                            color: 'rgba(255, 255, 240, 0.7)',
                                            '&.Mui-focused': { color: 'var(--dark-pink)' }
                                        },
                                        '& .MuiOutlinedInput-root': {
                                            color: '#FFFFF0',
                                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                            '& fieldset': { borderColor: 'rgba(255, 255, 240, 0.2)' },
                                            '&:hover fieldset': { borderColor: 'rgba(255, 255, 240, 0.4)' },
                                            '&.Mui-focused fieldset': { borderColor: 'var(--dark-pink)' }
                                        }
                                    }}
                                />
                            )}
                            PaperComponent={(props) => (
                                <Paper {...props} sx={{
                                    backgroundColor: 'var(--rich-charcoal)',
                                    border: '1px solid rgba(255, 255, 240, 0.1)',
                                    '& .MuiAutocomplete-option': {
                                        color: '#FFFFF0',
                                        '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.08)' },
                                        '&.Mui-focused': { backgroundColor: 'rgba(255, 255, 255, 0.12)' }
                                    }
                                }} />
                            )}
                        />
                    </Box>
                </Stack>

                {/* Hover Menu Popper */}
                <Popper
                    open={Boolean(anchorEl)}
                    anchorEl={anchorEl}
                    placement="bottom-start"
                    sx={{ zIndex: 1300 }}
                >
                    <ClickAwayListener onClickAway={handleMouseLeave}>
                        <Paper
                            onMouseEnter={() => setAnchorEl(anchorEl)}
                            onMouseLeave={handleMouseLeave}
                            sx={{
                                backgroundColor: 'var(--rich-charcoal)',
                                border: '1px solid rgba(255, 255, 240, 0.1)',
                                mt: 1,
                                maxHeight: 300,
                                overflow: 'auto',
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                            }}
                        >
                            <MenuList>
                                {menuType === 'franchise' && PLACEHOLDER_DATA.franchises.map((franchise) => (
                                    <MenuItem
                                        key={franchise.id}
                                        onClick={() => handleMenuItemClick('franchise', franchise.id)}
                                        sx={{
                                            color: '#FFFFF0',
                                            '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.08)' }
                                        }}
                                    >
                                        {franchise.label}
                                    </MenuItem>
                                ))}
                                {menuType === 'series' && PLACEHOLDER_DATA.series.map((series) => (
                                    <MenuItem
                                        key={series.id}
                                        onClick={() => handleMenuItemClick('series', series.id)}
                                        sx={{
                                            color: '#FFFFF0',
                                            '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.08)' }
                                        }}
                                    >
                                        {series.label}
                                    </MenuItem>
                                ))}
                            </MenuList>
                        </Paper>
                    </ClickAwayListener>
                </Popper>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2, backgroundColor: 'var(--rich-charcoal)' }}>
                <Button
                    onClick={handleReset}
                    variant="outlined"
                    sx={{
                        borderColor: 'rgba(255, 255, 240, 0.3)',
                        color: 'rgba(255, 255, 240, 0.7)',
                        '&:hover': {
                            borderColor: 'rgba(255, 255, 240, 0.5)',
                            backgroundColor: 'rgba(255, 255, 255, 0.05)'
                        }
                    }}
                >
                    Reset
                </Button>
                <Button
                    onClick={handleApply}
                    variant="contained"
                    sx={{
                        backgroundColor: 'var(--dark-pink)',
                        color: '#FFFFF0',
                        '&:hover': {
                            backgroundColor: 'hsl(327, 81%, 50%)'
                        }
                    }}
                >
                    Apply
                </Button>
            </DialogActions>
        </>
    );
}