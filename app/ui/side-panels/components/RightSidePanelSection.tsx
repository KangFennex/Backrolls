'use client'

import { Quote } from '../../../lib/definitions';
import { useContext } from 'react';
import { MiniQuoteCard } from '../../backrollCards/MiniQuoteCard';
import '../RightSidePanel.scss';
import { MdExpandLess, MdExpandMore } from "react-icons/md";
import { NavigationContext } from '../../../context/NavigationContext';

interface RightSidePanelSectionProps {
    title: string;
    data: Quote[];
    isLoading: boolean;
    error?: unknown;
    isInitialExpand: boolean;
    isExpanded: boolean;
    onToggle: () => void;
}

export default function RightSidePanelSection({
    title,
    data,
    isLoading,
    isInitialExpand,
    isExpanded,
    onToggle
}: RightSidePanelSectionProps) {
    const context = useContext(NavigationContext);

    if (!context) {
        throw new Error('RightSidePanelSection must be used within a NavigationProvider');
    }

    const { navigateToBackroll } = context;

    const handleClick = (quote: Quote) => {
        navigateToBackroll(quote);
    }


    if (isLoading) {
        return <p className="loading-text">Loading...</p>;
    }

    if (!isLoading && data.length === 0) {
        return <p className="no-data-text">No data available.</p>;
    }

    // Determine the content class based on state
    const getContentClass = () => {
        if (isExpanded) return 'expanded';
        if (isInitialExpand) return 'initial-expand';
        return 'collapsed';
    };

    return (
        <div className={`
            right-side-panel-section
            overflowY: auto,
            ${isExpanded ? 'expanded' : 'collapsed'} 
            ${isInitialExpand ? 'initial-expand' : ''}`}>

            {/* Clickable header to toggle expansion */}
            <div
                className="section-header"
                onClick={onToggle}
            >
                {/* {selectIcon()} */}
                <h3 className="section-title">{title}</h3>
                <span className="toggle-icon">
                    {isExpanded ? <MdExpandLess size={20} /> : <MdExpandMore size={20} />}
                </span>
            </div>

            {/* Scrollable content area */}
            <div className={`section-content ${getContentClass()}`}>
                <div className="quote-list">
                    {data.map((quote: Quote) => (
                        <div key={quote.id} className="quote-item">
                            <MiniQuoteCard
                                quote={quote}
                                onClick={() => handleClick(quote)}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}