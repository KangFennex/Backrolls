'use client'

import { Autocomplete, TextField, Paper } from '@mui/material';

const REGIONS = [
    { value: 'americas', label: 'Americas' },
    { value: 'asia', label: 'Asia' },
    { value: 'europe', label: 'Europe' },
    { value: 'africa', label: 'Africa' },
    { value: 'global', label: 'Global' }
];

interface RegionFilterProps {
    value: string;
    onChange: (value: string) => void;
}

export default function RegionFilter({ value, onChange }: RegionFilterProps) {
    const selectedRegion = REGIONS.find(r => r.value === value);

    return (
        <Autocomplete
            options={REGIONS}
            getOptionLabel={(option) => option.label}
            value={selectedRegion || REGIONS[0]}
            onChange={(_, newValue) => onChange(newValue?.value || 'americas')}
            disableClearable
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Region"
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
