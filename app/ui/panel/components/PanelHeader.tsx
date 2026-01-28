'use client';

import { RiCloseLargeFill } from "react-icons/ri";

interface PanelHeaderProps {
    onClose: () => void;
}

export function PanelHeader({ onClose }: PanelHeaderProps) {
    return (
        <div className="side-panel__header">
            <button
                aria-label="Close panel"
                onClick={onClose}
                className="side-panel__close-btn"
            >
                <RiCloseLargeFill />
            </button>
        </div>
    );
}
