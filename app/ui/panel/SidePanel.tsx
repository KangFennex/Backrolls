"use client";

import "@/app/scss/components/SidePanel.scss";
import { PanelHeader } from './components/PanelHeader';
import { PanelLinks } from './components/PanelLinks';
import { PanelAuthButton } from './components/PanelAuthButton';

interface SidePanelProps {
    open: boolean;
    onClose: () => void;
    anchor?: 'left' | 'right';
}

export default function SidePanel({ open, onClose, anchor = 'left' }: SidePanelProps) {
    return (
        <>
            {/* Backdrop */}
            <div 
                className={`side-panel__backdrop ${open ? 'side-panel__backdrop--open' : ''}`}
                onClick={onClose}
            />

            {/* Drawer */}
            <div className={`side-panel__drawer ${open ? 'side-panel__drawer--open' : ''} ${anchor === 'right' ? 'side-panel__drawer--right' : ''}`}>
                <div className="side-panel__content">
                    {/* Panel Header */}
                    <PanelHeader onClose={onClose} />

                    {/* Panel Links */}
                    <PanelLinks onClose={onClose} />

                    {/* Auth Button */}
                    <PanelAuthButton onClose={onClose} />
                </div>
            </div>
        </>
    );
}
