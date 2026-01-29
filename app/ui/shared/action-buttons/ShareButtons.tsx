'use client';

import '@/app/scss/components/ActionButtons.scss';
import { IoShareSocialSharp } from 'react-icons/io5';
import React from 'react';

// Icon-only share button for BackrollCards
export function ShareButtonIcon() {
    return (
        <button className="action-btn__icon-only" aria-label="Share quote">
            <IoShareSocialSharp size={18} className="action-btn__icon" />
        </button>
    );
}

// Share button with text for Post Cards
export function ShareButton() {
    return (
        <button className="buttons-group" aria-label="Share quote">
            <IoShareSocialSharp size={18} className="action-btn__icon" />
            <span className="action-btn__text">Share</span>
        </button>
    );
}

// Post share button (with text and optional handler)
export function PostShareButton({
    onClick,
}: {
    onClick?: () => void;
}) {
    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onClick) {
            onClick();
        } else {
            console.log('Share clicked');
        }
    };

    return (
        <button className="buttons-group" onClick={handleClick}>
            <IoShareSocialSharp size={18} className="action-btn__icon" />
            <span className="action-btn__text">Share</span>
        </button>
    );
}
