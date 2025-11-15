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
    );
}
