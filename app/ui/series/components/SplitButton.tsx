'use client'

import * as React from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';

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
    backgroundColor: string;
    hoverColor: string;
    allowClear?: boolean;
    clearLabel?: string;
    placeholder?: string;
    disabled?: boolean;
}

export default function SplitButton({
    label,
    selectedValue,
    seriesCategory,
    options,
    onSelect,
    onMainClick,
    backgroundColor,
    hoverColor,
    allowClear = false,
    clearLabel = 'All',
    placeholder = 'Select',
    disabled = false
}: SplitButtonProps) {
    const [menuOpen, setMenuOpen] = React.useState(false);
    const anchorRef = React.useRef<HTMLDivElement>(null);

    const handleMainClick = () => {
        if (onMainClick) {
            onMainClick();
        } else {
            setMenuOpen(true);
        }
    };

    const handleToggle = () => setMenuOpen(prev => !prev);

    const handleClose = (event: Event) => {
        if (anchorRef.current?.contains(event.target as HTMLElement)) return;
        setMenuOpen(false);
    };

    const handleMenuItemClick = (value: string | number | null) => {
        onSelect(value);
        setMenuOpen(false);
    };

    const getDisplayText = () => {
        if (!selectedValue) return placeholder;
        const option = options.find(opt => opt.value === selectedValue);
        return option?.label || selectedValue;
    };

    return (
        <div className="filter-section">
            <React.Fragment>
                <ButtonGroup
                    variant="contained"
                    ref={anchorRef}
                    aria-label={`${label} selection`}
                    disabled={seriesCategory === "main-series" ? true : disabled}
                    sx={{
                        '& .MuiButton-root': {
                            backgroundColor,
                            color: '#2d3748',

                            '&:hover': { backgroundColor: hoverColor },
                        },
                        '&:disabled': {
                            backgroundColor: backgroundColor,
                            opacity: 0.85,
                            color: '#6b7280',
                            cursor: 'not-allowed',
                            '&:hover': {
                                backgroundColor: backgroundColor,
                                opacity: 0.65,
                            }
                        },
                        '& .MuiButtonGroup-grouped': {
                            minWidth: 'unset !important',
                        }
                    }}
                >
                    <Button onClick={handleMainClick} sx={{
                        display: 'flex',
                        position: 'relative',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0.1rem',
                        paddingLeft: '0.4rem',
                        paddingRight: '0.4rem',
                        width: 'auto',
                        borderRadius: '0.375rem',
                        color: '#1f2937',
                        fontWeight: 600,
                        '&:hover': {
                            backgroundColor: '#f3f4f6',
                        },
                        '&:disabled': {
                            color: '#9ca3af', // Ensure text is readable when disabled
                            opacity: 0.75,
                        },
                        textTransform: 'none', // Prevents MUI's default uppercase
                        minWidth: 'unset',
                    }}>
                        {getDisplayText()}
                    </Button>
                    <Button
                        sx={{
                            padding: '0',
                            width: 'auto',
                            minWidth: 'unset',
                            '&:disabled .MuiSvgIcon-root': {
                                color: '#9ca3af', // Make arrow icon visible
                            }
                        }}
                        aria-controls={menuOpen ? `${label.toLowerCase()}-menu` : undefined}
                        aria-expanded={menuOpen ? 'true' : undefined}
                        onClick={handleToggle}
                    >
                        <ArrowDropDownIcon />
                    </Button>
                </ButtonGroup>

                <Popper
                    sx={{ zIndex: 1300 }}
                    open={menuOpen}
                    anchorEl={anchorRef.current}
                    role={undefined}
                    transition
                    disablePortal
                >
                    {({ TransitionProps, placement }) => (
                        <Grow
                            {...TransitionProps}
                            style={{
                                transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
                            }}
                        >
                            <Paper>
                                <ClickAwayListener onClickAway={handleClose}>
                                    <MenuList id={`${label.toLowerCase()}-menu`} autoFocusItem>
                                        {allowClear && (
                                            <MenuItem
                                                selected={selectedValue === null}
                                                onClick={() => handleMenuItemClick(null)}
                                            >
                                                {clearLabel}
                                            </MenuItem>
                                        )}
                                        {options.map((option, index) => (
                                            <MenuItem
                                                key={index}
                                                selected={selectedValue === option.value}
                                                onClick={() => handleMenuItemClick(option.value)}
                                            >
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </MenuList>
                                </ClickAwayListener>
                            </Paper>
                        </Grow>
                    )}
                </Popper>
            </React.Fragment>
        </div>
    );
}