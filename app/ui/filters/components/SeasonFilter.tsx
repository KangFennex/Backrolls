'use client'

import { Autocomplete, TextField, Paper } from '@mui/material';
import { useSeriesFiltering } from '../../../lib/hooks/useSeriesFiltering';

interface SeasonFilterProps {
    seriesCode: string | null;
    value: number | null;
    onChange: (value: number | null) => void;
    disabled?: boolean;
}

export default function SeasonFilter({ seriesCode, value, onChange, disabled }: SeasonFilterProps) {
    const { getSeasonOptions } = useSeriesFiltering();

    const seasonOptions = seriesCode ? getSeasonOptions(seriesCode) : [];
    const selectedSeason = seasonOptions.find(s => s.value === value);

    return (
        <Autocomplete
            options={seasonOptions}
            getOptionLabel={(option) => option.label}
            value={selectedSeason || null}
            onChange={(_, newValue) => onChange(newValue?.value || null)}
            disabled={disabled || !seriesCode}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Season"
                    placeholder={seriesCode ? "Select season..." : "Select series first"}
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
