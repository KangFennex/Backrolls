'use client'

import './RightSidePanel.scss';
import RightSidePanelSection from './components/RightSidePanelSection';
import { useState } from 'react';
import { useFreshQuotes, useHotQuotes, useQuotesByCommentCount } from '../../lib/hooks';

export default function RightSidePanel() {
    const { data: freshData, isFreshLoading } = useFreshQuotes(10);
    const { data: hotData, isLoading: isHotLoading } = useHotQuotes(10);
    const { data: commentCountData, isLoading: isCommentCountLoading } = useQuotesByCommentCount(10);

    const [expandedSection, setExpandedSection] = useState<'fresh' | 'hot' | 'commentCount' | null>(null);
    const [hasUserInteracted, setHasUserInteracted] = useState(false);

    const toggleIsExpanded = (section: 'fresh' | 'hot' | 'commentCount') => {
        setHasUserInteracted(true);
        setExpandedSection(current => current === section ? null : section);
    }

    // Both sections are initially expanded until user interacts
    const isFreshInitial = !hasUserInteracted;
    const isHotInitial = !hasUserInteracted;
    const isCommentCountInitial = !hasUserInteracted;
    const isFreshExpanded = expandedSection === 'fresh';
    const isHotExpanded = expandedSection === 'hot';
    const isCommentCountExpanded = expandedSection === 'commentCount';

    return (
        <div className="right-side-panel-container scrollbar-hide">
            <RightSidePanelSection
                title="Talk of the Town"
                data={commentCountData?.quotes || []}
                isLoading={isCommentCountLoading}
                isInitialExpand={isCommentCountInitial}
                isExpanded={isCommentCountExpanded}
                onToggle={() => toggleIsExpanded('commentCount')}
            />
            <RightSidePanelSection
                title="Fresh Backrolls"
                data={freshData?.quotes || []}
                isLoading={isFreshLoading}
                isInitialExpand={isFreshInitial}
                isExpanded={isFreshExpanded}
                onToggle={() => toggleIsExpanded('fresh')}
            />
            <RightSidePanelSection
                title="Hot Backrolls"
                data={hotData?.quotes || []}
                isLoading={isHotLoading}
                isInitialExpand={isHotInitial}
                isExpanded={isHotExpanded}
                onToggle={() => toggleIsExpanded('hot')}
            />
        </div>
    );
}