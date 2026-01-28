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
                            color: '#EE5BAC',
                            '&.Mui-focused': { color: '#EE5BAC' },
                            '&.Mui-disabled': { color: 'rgba(238, 91, 172, 0.4)' }
                        },
                        '& .MuiOutlinedInput-root': {
                            color: 'var(--cool-ghost-white)',
                            backgroundColor: 'rgba(238, 91, 172, 0.15)',
                            borderRadius: '12px',
                            '& fieldset': { borderColor: 'rgba(238, 91, 172, 0.3)' },
                            '&:hover fieldset': { borderColor: 'rgba(238, 91, 172, 0.5)' },
                            '&.Mui-focused fieldset': { borderColor: 'rgba(238, 91, 172, 0.5)' },
                            '& input': { color: 'var(--cool-ghost-white)' },
                            '&.Mui-disabled': {
                                backgroundColor: 'rgba(238, 91, 172, 0.08)',
                                color: 'rgba(238, 91, 172, 0.4)',
                                '& input': { color: 'rgba(238, 91, 172, 0.4)' }
                            }
                        }
                    }}
                />
            )}
            PaperComponent={(props) => (
                <Paper {...props} sx={{
                    backgroundColor: 'rgba(30, 30, 40, 0.95)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(238, 91, 172, 0.3)',
                    borderRadius: '12px',
                    '& .MuiAutocomplete-option': {
                        color: 'var(--cool-ghost-white)',
                        '&:hover': { backgroundColor: 'rgba(238, 91, 172, 0.15)' },
                        '&.Mui-focused': { backgroundColor: 'rgba(238, 91, 172, 0.2)' }
                    }
                }} />
            )}
        />
    );
}
