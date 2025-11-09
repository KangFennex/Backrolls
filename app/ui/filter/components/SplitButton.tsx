'use client'

import * as React from 'react';
import { Theme, useTheme } from '@mui/material/styles';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { SplitButtonProps } from '../../../lib/definitions';

function getStyles(value: string | number, selectedValue: string | number | null, theme: Theme) {
    return {
        fontWeight: selectedValue === value
            ? theme.typography.fontWeightMedium
            : theme.typography.fontWeightRegular,
    };
}

export default function SplitButton({
    label,
    selectedValue,
    seriesCategory,
    options,
    onSelect,
    allowClear = false,
    clearLabel = 'All',
    disabled = false
}: SplitButtonProps) {
    const theme = useTheme();

    const handleChange = (event: SelectChangeEvent<string | number>) => {
        const value = event.target.value;
        onSelect(value === '' ? null : value);
    };

    const getDisplayValue = () => {
        if (seriesCategory === "main-series") {
            return 'RuPaul\'s Drag Race';
        }
        if (selectedValue === null || selectedValue === undefined) {
            return '';
        }
        return selectedValue;
    };

    return (
        <div className="filter-section">
            <FormControl
                variant="outlined"
                fullWidth
                sx={{
                    minWidth: 200,
                    '& .MuiInputLabel-root': {
                        color: 'rgba(255, 255, 240, 0.7)',
                        '&.Mui-focused': {
                            color: 'var(--dark-pink)',
                        },
                        '&.MuiInputLabel-shrink': {
                            color: 'var(--dark-pink)',
                        },
                    },
                    '& .MuiOutlinedInput-root': {
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: 2,
                        '& fieldset': {
                            borderColor: 'rgba(255, 255, 240, 0.2)',
                        },
                        '&:hover fieldset': {
                            borderColor: 'rgba(255, 255, 240, 0.4)',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: 'var(--dark-pink)',
                            borderWidth: 2,
                        },
                        '&.Mui-disabled': {
                            backgroundColor: 'rgba(255, 255, 255, 0.02)',
                            '& fieldset': {
                                borderColor: 'rgba(255, 255, 240, 0.1)',
                            },
                        },
                    },
                    '& .MuiSelect-select': {
                        color: '#FFFFF0',
                        padding: '12px 14px',
                        fontSize: '0.95rem',
                        '&.Mui-disabled': {
                            color: 'rgba(255, 255, 240, 0.3)',
                        },
                    },
                    '& .MuiSvgIcon-root': {
                        color: 'rgba(255, 255, 240, 0.7)',
                        '&.Mui-disabled': {
                            color: 'rgba(255, 255, 240, 0.2)',
                        },
                    },
                }}
            >
                <InputLabel id={`${label.toLowerCase()}-label`}>{label}</InputLabel>
                <Select
                    labelId={`${label.toLowerCase()}-label`}
                    id={`${label.toLowerCase()}-select`}
                    value={getDisplayValue()}
                    onChange={handleChange}
                    label={label}
                    MenuProps={{
                        PaperProps: {
                            sx: {
                                backgroundColor: 'var(--rich-charcoal)',
                                border: '1px solid rgba(255, 255, 240, 0.1)',
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                                '& .MuiMenuItem-root': {
                                    color: '#FFFFF0',
                                    fontSize: '0.95rem',
                                    padding: '10px 16px',
                                    '&:hover': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.08)',
                                    },
                                    '&.Mui-selected': {
                                        backgroundColor: 'var(--dark-pink)',
                                        color: '#FFFFF0',
                                        fontWeight: 600,
                                        '&:hover': {
                                            backgroundColor: 'hsl(327, 81%, 50%)',
                                        },
                                    },
                                },
                            },
                        },
                        anchorOrigin: {
                            vertical: 'bottom',
                            horizontal: 'left',
                        },
                        transformOrigin: {
                            vertical: 'top',
                            horizontal: 'left',
                        },
                    }}
                    disabled={seriesCategory === "main-series" ? true : disabled}
                >
                    {allowClear && (
                        <MenuItem
                            value=""
                            style={getStyles('', selectedValue, theme)}
                        >
                            {clearLabel}
                        </MenuItem>
                    )}
                    {options.map((option) => (
                        <MenuItem
                            key={option.value}
                            value={option.value}
                            style={getStyles(option.value, selectedValue, theme)}
                        >
                            {option.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
}