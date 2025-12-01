'use client'

import { Quote } from '../../../lib/definitions';
import { useContext } from 'react';
import { MiniQuoteCard } from '../../backrollCards/MiniQuoteCard';
import '../RightSidePanel.scss';
import { MdExpandLess, MdExpandMore } from "react-icons/md";
import { NavigationContext } from '../../../context/NavigationContext';
import { GiConversation } from "react-icons/gi";
import { FaFire } from "react-icons/fa6";
import { FaRegClock } from "react-icons/fa";

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
    const { navigateToBackroll } = useContext(NavigationContext);

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

    /*     const selectIcon = () => {
            if (title === "Talk of the Town") {
                return (
                    <GiConversation size={24} color="white" />
                );
            }
            if (title === "Hot Backrolls") {
                return (
                    <FaFire size={24} color="red" />
                );
            }
            if (title === "Fresh Backrolls") {
                return (
                    <FaRegClock size={24} color="green" />
                );
            }
            return null;
        };
     */
    return (
        <div className={`
            right-side-panel-section
            overflowY: auto,
            ${isExpanded ? 'expanded' : 'collapsed'} 
            ${isInitialExpand ? 'initial-expand' : ''}`}>

            {/* Clickable header to toggle expansion */}
            <div
                className="section-header cursor-pointer flex justify-between items-center p-2 gap-2"
                onClick={onToggle}
            >
                {/* {selectIcon()} */}
                <h3 className="section-title mr-auto w-full text-[var(--antique-parchment-dark)]! text-[0.7rem]!">{title}</h3>
                <span className="toggle-icon rounded-full hover:bg-gray-700 transition-colors duration-300 group">
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