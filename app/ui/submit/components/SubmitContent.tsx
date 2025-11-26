'use client';

import { useState, useEffect, useCallback } from 'react';
import {
    CardContent,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    Alert,
    CircularProgress,
    Grid
} from '@mui/material';
import { useSeriesFiltering } from '../../../lib/hooks';
import { useSession } from 'next-auth/react';
import { useSubmitQuote } from '../../../lib/hooks';

export default function SubmitContent() {
    const {
        getSeriesByRegion,
        getSeasonOptions,
        getEpisodeOptions,
        getSeriesOriginalLanguage,
        LANGUAGES
    } = useSeriesFiltering();

    const { data: session } = useSession();
    const isAuthenticated = !!session?.user;
    const submitQuoteMutation = useSubmitQuote();

    const [formData, setFormData] = useState({
        region: 'americas',
        series: '',
        series_code: '',
        season: '',
        episode: '',
        type: '',
        quote_text: '',
        speaker: '',
        timestamp: '',
        episode_title: '',
        original_language: 'english',
        original_language_text: '',
        context: '',
    });

    const [availableSeries, setAvailableSeries] = useState<string[]>([]);
    const [availableSeasons, setAvailableSeasons] = useState<number[]>([]);
    const [availableEpisodes, setAvailableEpisodes] = useState<number[]>([]);
    const [validationErrors, setValidationErrors] = useState<string[]>([]);

    // Check if original language is not English
    const showOriginalLanguageText = formData.original_language !== LANGUAGES.ENGLISH;

    // Initialize form data - only run once
    useEffect(() => {
        const americasSeries = getSeriesByRegion('americas');
        setAvailableSeries(americasSeries);

        // Set default series to RPDR
        const rpdrSeries = americasSeries.find(s => s.code === 'rpdr');

        if (rpdrSeries) {
            setFormData(prev => ({
                ...prev,
                series: rpdrSeries.name,
                series_code: rpdrSeries.code,
                type: rpdrSeries.type
            }));
        }
    }, [getSeriesByRegion]);

    // Update seasons when series changes
    useEffect(() => {
        if (formData.series_code) {
            const seasons = getSeasonOptions(formData.series_code);
            setAvailableSeasons(seasons);
            setFormData(prev => ({ ...prev, season: '', episode: '' }));
        } else {
            setAvailableSeasons([]);
        }
    }, [formData.series_code, getSeasonOptions]);

    // Update episodes when season changes
    useEffect(() => {
        if (formData.series_code && formData.season) {
            const seasonNum = parseInt(formData.season);
            const episodes = getEpisodeOptions(formData.series_code, seasonNum);
            setAvailableEpisodes(episodes);
            setFormData(prev => ({ ...prev, episode: '' }));
        } else {
            setAvailableEpisodes([]);
        }
    }, [formData.series_code, formData.season, getEpisodeOptions]);

    // Update original language when series changes
    useEffect(() => {
        if (formData.series_code) {
            const originalLanguage = getSeriesOriginalLanguage(formData.series_code);
            setFormData(prev => ({
                ...prev,
                original_language: originalLanguage
            }));
        }
    }, [formData.series_code, getSeriesOriginalLanguage]);

    const handleRegionChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        const selectedRegion = event.target.value as string;
        const regionSeries = getSeriesByRegion(selectedRegion);
        setAvailableSeries(regionSeries);
        setValidationErrors([]);

        // Auto-select first series in the region
        const firstSeries = regionSeries[0];
        setFormData(prev => ({
            ...prev,
            region: selectedRegion,
            series: firstSeries?.name || '',
            series_code: firstSeries?.code || '',
            type: firstSeries?.type || '',
            season: '',
            episode: ''
        }));
    };

    const handleSeriesChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        const selectedSeriesName = event.target.value as string;
        const selectedSeries = availableSeries.find(s => s.name === selectedSeriesName);
        setValidationErrors([]);

        if (selectedSeries) {
            setFormData(prev => ({
                ...prev,
                series: selectedSeries.name,
                series_code: selectedSeries.code,
                type: selectedSeries.type,
                season: '',
                episode: ''
            }));
        }
    };

    const handleSeasonChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        const selectedSeason = event.target.value as string;
        setFormData(prev => ({ ...prev, season: selectedSeason, episode: '' }));
        setValidationErrors([]);
    };

    const handleEpisodeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        const selectedEpisode = event.target.value as string;
        setFormData(prev => ({ ...prev, episode: selectedEpisode }));
        setValidationErrors([]);
    };

    const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [field]: event.target.value }));
        setValidationErrors([]);
    };

    const resetToInitialState = useCallback(() => {
        const americasSeries = getSeriesByRegion('americas');
        setAvailableSeries(americasSeries);

        const rpdrSeries = americasSeries.find(s => s.code === 'rpdr');

        if (rpdrSeries) {
            setFormData({
                region: 'americas',
                series: rpdrSeries.name,
                series_code: rpdrSeries.code,
                type: rpdrSeries.type,
                season: '',
                episode: '',
                quote_text: '',
                speaker: '',
                timestamp: '',
                episode_title: '',
                original_language: getSeriesOriginalLanguage(rpdrSeries.code),
                original_language_text: '',
                context: '',
            });
        }
    }, [getSeriesByRegion, getSeriesOriginalLanguage]);

    // Use in both useEffect and handleClearFilters
    useEffect(() => {
        resetToInitialState();
    }, [resetToInitialState]);

    const handleClearFilters = () => {
        resetToInitialState();
        setValidationErrors([]);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!isAuthenticated) {
            return;
        }

        // Validate required fields
        const errors = [];
        if (!formData.quote_text.trim()) errors.push('Quote text is required');
        if (!formData.speaker.trim()) errors.push('Speaker is required');
        if (!formData.timestamp.trim()) errors.push('Timestamp is required');
        if (!formData.season) errors.push('Season is required');
        if (!formData.episode) errors.push('Episode is required');

        if (errors.length > 0) {
            setValidationErrors(errors);
            return;
        }

        try {
            await submitQuoteMutation.mutateAsync({
                region: formData.region,
                series: formData.series,
                series_code: formData.series_code,
                season: parseInt(formData.season),
                episode: parseInt(formData.episode),
                quote_text: formData.quote_text,
                speaker: formData.speaker,
                timestamp: formData.timestamp,
                episode_title: formData.episode_title,
                type: formData.type,
                original_language: formData.original_language,
                context: formData.context,
            });

            // Success - reset form but keep series selection
            handleClearFilters();

        } catch (error) {
            console.error('Failed to submit quote:', error);
        }
    };

    const isLoading = submitQuoteMutation.isLoading;

    return (
        <CardContent sx={{
            backgroundColor: 'transparent',
            maxWidth: 800,
            margin: '0 auto'
        }}>
            {!isAuthenticated && (
                <Alert severity="warning" sx={{ mb: 3 }}>
                    You must be logged in to submit a quote.
                </Alert>
            )}

            {validationErrors.length > 0 && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {validationErrors.map((error, index) => (
                        <div key={index}>• {error}</div>
                    ))}
                </Alert>
            )}

            {submitQuoteMutation.isError && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {submitQuoteMutation.error?.message || 'Failed to submit quote. Please try again.'}
                </Alert>
            )}

            {submitQuoteMutation.isSuccess && (
                <Alert severity="success" sx={{ mb: 3 }}>
                    Quote submitted successfully! It will be reviewed before appearing on the site.
                </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                <Grid container spacing={3}>
                    {/* First Line: Region and Series */}
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth variant="outlined">
                            <InputLabel sx={{ color: 'white' }}>Region</InputLabel>
                            <Select
                                key={formData.region}
                                value={formData.region}
                                onChange={handleRegionChange}
                                label="Region"
                                sx={{
                                    color: 'white',
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'rgba(255, 255, 255, 0.3)',
                                    },
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'rgba(255, 255, 255, 0.5)',
                                    },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'white',
                                    },
                                }}
                            >
                                <MenuItem value="americas">Americas</MenuItem>
                                <MenuItem value="europe">Europe</MenuItem>
                                <MenuItem value="asia">Asia</MenuItem>
                                <MenuItem value="oceania">Oceania</MenuItem>
                                <MenuItem value="global">Global</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth variant="outlined">
                            <InputLabel sx={{ color: 'white' }}>Series</InputLabel>
                            <Select
                                key={formData.series}
                                value={formData.series}
                                onChange={handleSeriesChange}
                                label="Series"
                                sx={{
                                    color: 'white',
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'rgba(255, 255, 255, 0.3)',
                                    },
                                }}
                            >
                                {availableSeries.map((series) => (
                                    <MenuItem key={series.code} value={series.name}>
                                        {series.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* Second Line: Season, Episode, and Speaker */}
                    <Grid item xs={12} sm={4}>
                        <FormControl fullWidth variant="outlined">
                            <InputLabel sx={{ color: 'white' }}>Season</InputLabel>
                            <Select
                                value={formData.season}
                                onChange={handleSeasonChange}
                                label="Season"
                                disabled={!formData.series_code}
                                sx={{
                                    color: 'white',
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'rgba(255, 255, 255, 0.3)',
                                    },
                                }}
                            >
                                {availableSeasons.map((season) => (
                                    <MenuItem key={season.value} value={season.value}>
                                        {season.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <FormControl fullWidth variant="outlined">
                            <InputLabel sx={{ color: 'white' }}>Episode</InputLabel>
                            <Select
                                value={formData.episode}
                                onChange={handleEpisodeChange}
                                label="Episode"
                                disabled={!formData.season}
                                sx={{
                                    color: 'white',
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'rgba(255, 255, 255, 0.3)',
                                    },
                                }}
                            >
                                {availableEpisodes.map((episode) => (
                                    <MenuItem key={episode.value} value={episode.value}>
                                        {episode.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            label="Speaker *"
                            value={formData.speaker}
                            onChange={handleInputChange('speaker')}
                            required
                            error={validationErrors.some(err => err.includes('Speaker'))}
                            sx={{
                                '& .MuiInputLabel-root': { color: 'white' },
                                '& .MuiOutlinedInput-root': {
                                    color: 'white',
                                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                                    '&.Mui-focused fieldset': { borderColor: 'white' },
                                },
                            }}
                        />
                    </Grid>

                    {/* Third Line: Quote (full width) */}
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Quote *"
                            value={formData.quote_text}
                            onChange={handleInputChange('quote_text')}
                            multiline
                            rows={3}
                            required
                            error={validationErrors.some(err => err.includes('Quote text'))}
                            sx={{
                                '& .MuiInputLabel-root': { color: 'white' },
                                '& .MuiOutlinedInput-root': {
                                    color: 'white',
                                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                                    '&.Mui-focused fieldset': { borderColor: 'white' },
                                },
                            }}
                        />
                    </Grid>

                    {/* Fourth Line: Timestamp and Context */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Timestamp *"
                            value={formData.timestamp}
                            onChange={handleInputChange('timestamp')}
                            placeholder="e.g., 01:23:45 or 15m30s"
                            required
                            error={validationErrors.some(err => err.includes('Timestamp'))}
                            sx={{
                                '& .MuiInputLabel-root': { color: 'white' },
                                '& .MuiOutlinedInput-root': {
                                    color: 'white',
                                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                                    '&.Mui-focused fieldset': { borderColor: 'white' },
                                },
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Context (Optional)"
                            value={formData.context}
                            onChange={handleInputChange('context')}
                            multiline
                            rows={2}
                            sx={{
                                '& .MuiInputLabel-root': { color: 'white' },
                                '& .MuiOutlinedInput-root': {
                                    color: 'white',
                                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                                    '&.Mui-focused fieldset': { borderColor: 'white' },
                                },
                            }}
                        />
                    </Grid>

                    {/* Conditional Original Language Text */}
                    {showOriginalLanguageText && (
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Original Language Text (Optional)"
                                value={formData.original_language_text}
                                onChange={handleInputChange('original_language_text')}
                                multiline
                                rows={2}
                                placeholder={`Enter the original text in ${formData.original_language}`}
                                sx={{
                                    '& .MuiInputLabel-root': { color: 'white' },
                                    '& .MuiOutlinedInput-root': {
                                        color: 'white',
                                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                                        '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                                        '&.Mui-focused fieldset': { borderColor: 'white' },
                                    },
                                }}
                            />
                        </Grid>
                    )}

                    {/* Buttons */}
                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-start' }}>
                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                disabled={!isAuthenticated || isLoading}
                                sx={{
                                    backgroundColor: '#ff4081',
                                    '&:hover': {
                                        backgroundColor: '#f50057',
                                    },
                                    '&:disabled': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.12)',
                                    },
                                    minWidth: 120,
                                }}
                            >
                                {isLoading ? <CircularProgress size={24} /> : 'Submit Quote'}
                            </Button>

                            <Button
                                type="button"
                                variant="outlined"
                                size="large"
                                onClick={handleClearFilters}
                                sx={{
                                    color: 'white',
                                    borderColor: 'rgba(255, 255, 255, 0.3)',
                                    '&:hover': {
                                        borderColor: 'white',
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    },
                                    minWidth: 120,
                                }}
                            >
                                Clear Fields
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </CardContent>
    );
}