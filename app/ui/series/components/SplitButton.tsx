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
    backgroundColor?: string;
    hoverColor?: string;
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
    backgroundColor = '#f3f4f6',
    hoverColor = '#e5e7eb',
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
                    variant="text"
                    ref={anchorRef}
                    aria-label={`${label} selection`}
                    disabled={seriesCategory === "main-series" ? true : disabled}
                    sx={{
                        backgroundColor: backgroundColor,
                        borderRadius: '0.375rem',
                        border: 'none',
                        '& .MuiButton-root': {
                            backgroundColor: 'transparent',
                            color: '#374151',
                            border: 'none',
                            borderBottom: '2px solid #374151',
                            borderRadius: '0',
                            '&:hover': { 
                                backgroundColor: hoverColor,
                                borderBottom: '2px solid #374151',
                            },
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
                            border: 'none !important',
                            '&:not(:last-of-type)': {
                                borderRight: 'none !important',
                            }
                        }
                    }}
                >
                    <Button onClick={handleMainClick} sx={{
                        display: 'flex',
                        position: 'relative',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        padding: '0.5rem 0.75rem',
                        width: 'auto',
                        maxWidth: '120px',
                        border: 'none',
                        borderRadius: '0',
                        borderBottom: '2px solid #374151',
                        color: '#374151',
                        fontWeight: 500,
                        backgroundColor: 'transparent',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.05)',
                            borderBottom: '2px solid #374151',
                        },
                        '&:disabled': {
                            color: '#9ca3af',
                            opacity: 0.75,
                            borderBottom: '2px solid #9ca3af',
                        },
                        textTransform: 'none',
                        minWidth: 'unset',
                        '& .button-text': {
                            animation: 'none',
                            display: 'block',
                            width: '100%',
                        },
                        '&:hover .button-text': {
                            animation: 'scrollText 3s linear infinite',
                        },
                        '@keyframes scrollText': {
                            '0%': {
                                transform: 'translateX(0)',
                            },
                            '100%': {
                                transform: 'translateX(-100%)',
                            },
                        },
                    }}>
                        <span className="button-text">{getDisplayText()}</span>
                    </Button>
                    <Button
                        sx={{
                            padding: '0.5rem 0.25rem',
                            width: 'auto',
                            minWidth: 'unset',
                            border: 'none',
                            borderRadius: '0',
                            borderBottom: '2px solid #374151',
                            backgroundColor: 'transparent',
                            '&:hover': {
                                backgroundColor: 'rgba(0, 0, 0, 0.05)',
                                borderBottom: '2px solid #374151',
                            },
                            '&:disabled': {
                                borderBottom: '2px solid #9ca3af',
                            },
                            '&:disabled .MuiSvgIcon-root': {
                                color: '#9ca3af',
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