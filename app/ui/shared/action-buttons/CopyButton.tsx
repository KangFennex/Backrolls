'use client';

import '@/app/scss/components/ActionButtons.scss';
import { FaRegCopy } from 'react-icons/fa';

export function CopyButton({ textToCopy }: { textToCopy: string }) {
    const handleCopy = async (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await navigator.clipboard.writeText(textToCopy);
            console.log('Quote copied to clipboard');
        } catch (error) {
            console.error('Failed to copy quote:', error);
        }
    };

    return (
        <button className="action-btn__icon-only" aria-label="Copy quote to clipboard" onClick={handleCopy}>
            <FaRegCopy size={16} className="action-btn__icon" />
        </button>
    );
}
