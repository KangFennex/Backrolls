'use client'

import { Autocomplete, TextField, Paper } from '@mui/material';
import { series } from '../../../lib/newRepertoire';

interface SeriesFilterProps {
    region: string;
    value: string | null;
    onChange: (value: string | null) => void;
}

export default function SeriesFilter({ region, value, onChange }: SeriesFilterProps) {
    const seriesOptions = series
        .filter(s => s.region === region)
        .map(s => ({ value: s.code, label: s.name }));

    const selectedSeries = seriesOptions.find(s => s.value === value);

    return (
        <Autocomplete
            options={seriesOptions}
            getOptionLabel={(option) => option.label}
            value={selectedSeries || null}
            onChange={(_, newValue) => onChange(newValue?.value || null)}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Series"
                    placeholder="Search or select series..."
                    sx={{
                        '& .MuiInputLabel-root': {
                            color: '#EE5BAC',
                            '&.Mui-focused': { color: '#EE5BAC' }
                        },
                        '& .MuiOutlinedInput-root': {
                            color: 'var(--cool-ghost-white)',
                            backgroundColor: 'rgba(238, 91, 172, 0.15)',
                            borderRadius: '12px',
                            '& fieldset': { borderColor: 'rgba(238, 91, 172, 0.3)' },
                            '&:hover fieldset': { borderColor: 'rgba(238, 91, 172, 0.5)' },
                            '&.Mui-focused fieldset': { borderColor: 'rgba(238, 91, 172, 0.5)' }
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
