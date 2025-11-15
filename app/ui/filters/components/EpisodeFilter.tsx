'use client'

import { Autocomplete, TextField, Paper } from '@mui/material';
import { useSeriesFiltering } from '../../../lib/hooks/useSeriesFiltering';

interface EpisodeFilterProps {
    seriesCode: string | null;
    season: number | null;
    value: number | null;
    onChange: (value: number | null) => void;
    disabled?: boolean;
}

export default function EpisodeFilter({ seriesCode, season, value, onChange, disabled }: EpisodeFilterProps) {
    const { getEpisodeOptions } = useSeriesFiltering();

    const episodeOptions = seriesCode && season ? getEpisodeOptions(seriesCode, season) : [];
    const selectedEpisode = episodeOptions.find(e => e.value === value);

    return (
        <Autocomplete
            options={episodeOptions}
            getOptionLabel={(option) => option.label}
            value={selectedEpisode || null}
            onChange={(_, newValue) => onChange(newValue?.value || null)}
            disabled={disabled || !seriesCode || !season}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Episode"
                    placeholder={season ? "Select episode..." : "Select season first"}
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
    );
}
