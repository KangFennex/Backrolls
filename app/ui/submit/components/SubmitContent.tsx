'use client';

import { useState, useEffect, useCallback } from 'react';
import {
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import { useSeriesFiltering } from '../../../lib/hooks';
import { useSession } from 'next-auth/react';
import { useSubmitQuote } from '../../../lib/hooks';

interface DragRaceSeries {
    code: string;
    name: string;
    type: "main-series" | "spin-off" | "international" | "all-stars";
    region?: "americas" | "asia" | "europe" | "oceania" | "africa" | "global";
    original_language: string;
}

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

    const [availableSeries, setAvailableSeries] = useState<DragRaceSeries[]>([]);
    const [availableSeasons, setAvailableSeasons] = useState<{ value: number; label: string }[]>([]);
    const [availableEpisodes, setAvailableEpisodes] = useState<{ value: number; label: string }[]>([]);
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

    const handleRegionChange = (event: { target: { value: string } }) => {
        const selectedRegion = event.target.value;
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

    const handleSeriesChange = (event: { target: { value: string } }) => {
        const selectedSeriesName = event.target.value;
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

    const handleSeasonChange = (event: { target: { value: string } }) => {
        const selectedSeason = event.target.value;
        setFormData(prev => ({ ...prev, season: selectedSeason, episode: '' }));
        setValidationErrors([]);
    };

    const handleEpisodeChange = (event: { target: { value: string } }) => {
        const selectedEpisode = event.target.value;
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

    const isLoading = submitQuoteMutation.isPending;

    return (
        <div className="submit-content submit-mui-override">
            {!isAuthenticated && (
                <div className="submit-content__alert submit-content__alert--warning">
                    You must be logged in to submit a quote.
                </div>
            )}

            {validationErrors.length > 0 && (
                <div className="submit-content__alert submit-content__alert--error">
                    {validationErrors.map((error, index) => (
                        <div key={index}>• {error}</div>
                    ))}
                </div>
            )}

            {submitQuoteMutation.isError && (
                <div className="submit-content__alert submit-content__alert--error">
                    {submitQuoteMutation.error?.message || 'Failed to submit quote. Please try again.'}
                </div>
            )}

            {submitQuoteMutation.isSuccess && (
                <div className="submit-content__alert submit-content__alert--success">
                    Quote submitted successfully! It will be reviewed before appearing on the site.
                </div>
            )}

            <form onSubmit={handleSubmit} className="submit-content__form">
                <div className="submit-content__row">
                    {/* Region */}
                    <div className="submit-content__field submit-content__field--half">
                        <FormControl fullWidth variant="outlined">
                            <InputLabel>Region</InputLabel>
                            <Select
                                key={formData.region}
                                value={formData.region}
                                onChange={handleRegionChange}
                                label="Region"
                            >
                                <MenuItem value="americas">Americas</MenuItem>
                                <MenuItem value="europe">Europe</MenuItem>
                                <MenuItem value="asia">Asia</MenuItem>
                                <MenuItem value="oceania">Oceania</MenuItem>
                                <MenuItem value="global">Global</MenuItem>
                            </Select>
                        </FormControl>
                    </div>

                    {/* Series */}
                    <div className="submit-content__field submit-content__field--half">
                        <FormControl fullWidth variant="outlined">
                            <InputLabel>Series</InputLabel>
                            <Select
                                key={formData.series}
                                value={formData.series}
                                onChange={handleSeriesChange}
                                label="Series"
                            >
                                {availableSeries.map((series) => (
                                    <MenuItem key={series.code} value={series.name}>
                                        {series.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                </div>

                <div className="submit-content__row">
                    {/* Season */}
                    <div className="submit-content__field submit-content__field--third">
                        <FormControl fullWidth variant="outlined">
                            <InputLabel>Season</InputLabel>
                            <Select
                                value={formData.season}
                                onChange={handleSeasonChange}
                                label="Season"
                                disabled={!formData.series_code}
                            >
                                {availableSeasons.map((season) => (
                                    <MenuItem key={season.value} value={season.value}>
                                        {season.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>

                    {/* Episode */}
                    <div className="submit-content__field submit-content__field--third">
                        <FormControl fullWidth variant="outlined">
                            <InputLabel>Episode</InputLabel>
                            <Select
                                value={formData.episode}
                                onChange={handleEpisodeChange}
                                label="Episode"
                                disabled={!formData.season}
                            >
                                {availableEpisodes.map((episode) => (
                                    <MenuItem key={episode.value} value={episode.value}>
                                        {episode.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>

                    {/* Speaker */}
                    <div className="submit-content__field submit-content__field--third">
                        <TextField
                            fullWidth
                            label="Speaker *"
                            value={formData.speaker}
                            onChange={handleInputChange('speaker')}
                            required
                            error={validationErrors.some(err => err.includes('Speaker'))}
                        />
                    </div>
                </div>

                {/* Quote */}
                <div className="submit-content__field submit-content__field--full">
                    <TextField
                        fullWidth
                        label="Quote *"
                        value={formData.quote_text}
                        onChange={handleInputChange('quote_text')}
                        multiline
                        rows={3}
                        required
                        error={validationErrors.some(err => err.includes('Quote text'))}
                    />
                </div>

                <div className="submit-content__row">
                    {/* Timestamp */}
                    <div className="submit-content__field submit-content__field--half">
                        <TextField
                            fullWidth
                            label="Timestamp *"
                            value={formData.timestamp}
                            onChange={handleInputChange('timestamp')}
                            placeholder="e.g., 01:23:45 or 15m30s"
                            required
                            error={validationErrors.some(err => err.includes('Timestamp'))}
                        />
                    </div>

                    {/* Context */}
                    <div className="submit-content__field submit-content__field--half">
                        <TextField
                            fullWidth
                            label="Context (Optional)"
                            value={formData.context}
                            onChange={handleInputChange('context')}
                            multiline
                            rows={2}
                        />
                    </div>
                </div>

                {/* Conditional Original Language Text */}
                {showOriginalLanguageText && (
                    <div className="submit-content__field submit-content__field--full">
                        <TextField
                            fullWidth
                            label="Original Language Text (Optional)"
                            value={formData.original_language_text}
                            onChange={handleInputChange('original_language_text')}
                            multiline
                            rows={2}
                            placeholder={`Enter the original text in ${formData.original_language}`}
                        />
                    </div>
                )}

                {/* Buttons */}
                <div className="submit-content__buttons">
                    <button
                        type="submit"
                        className="submit-content__button submit-content__button--submit"
                        disabled={!isAuthenticated || isLoading}
                    >
                        {isLoading ? (
                            <span className="submit-content__loading"></span>
                        ) : (
                            'Submit Quote'
                        )}
                    </button>

                    <button
                        type="button"
                        className="submit-content__button submit-content__button--clear"
                        onClick={handleClearFilters}
                    >
                        Clear Fields
                    </button>
                </div>
            </form>
        </div>
    );
}