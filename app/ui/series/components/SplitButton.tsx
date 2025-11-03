'use client'

import * as React from 'react';
import { Theme, useTheme } from '@mui/material/styles';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

const ITEM_HEIGHT = 28;
const ITEM_PADDING_TOP = 2;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 150,
        },
    },
};

interface SplitButtonOption {
    value: string | number;
    label: string;
}

interface SplitButtonProps {
    label: string;
    selectedValue: string | number | null;
    seriesCategory?: string;
    options: SplitButtonOption[];
    onSelect: (value: string | number | null) => void;
    onMainClick?: () => void;
    backgroundColor?: string;
    hoverColor?: string;
    allowClear?: boolean;
    clearLabel?: string;
    placeholder?: string;
    disabled?: boolean;
}

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
        if (selectedValue === null || selectedValue === undefined) {
            return '';
        }
        return selectedValue;
    };

    return (
        <div className="filter-section">
            <FormControl
                variant="standard"
                sx={{
                    width: 120,
                    '& .MuiInputLabel-root': {
                        color: '#89DAFF',
                        '&.Mui-focused': {
                            color: '#89DAFF',
                        },
                    },
                    '& .MuiInput-underline:before': {
                        borderBottomColor: '#89DAFF',
                    },
                    '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                        borderBottomColor: '#89DAFF',
                    },
                    '& .MuiInput-underline:after': {
                        borderBottomColor: '#89DAFF',
                    },
                    '& .MuiSelect-select': {
                        color: 'white',
                        padding: '4px 0',
                    },
                    '& .MuiSvgIcon-root': {
                        color: 'white',
                    },
                }}
            >
                <InputLabel id={`${label.toLowerCase()}-label`}>{label}</InputLabel>
                <Select
                    labelId={`${label.toLowerCase()}-label`}
                    id={`${label.toLowerCase()}-select`}
                    value={getDisplayValue()}
                    onChange={handleChange}
                    MenuProps={MenuProps}
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