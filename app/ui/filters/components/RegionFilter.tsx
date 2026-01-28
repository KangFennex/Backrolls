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
