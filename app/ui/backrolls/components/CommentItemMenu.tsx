'use client';

import { createPortal } from 'react-dom';
import { MdEdit, MdDelete } from "react-icons/md";
import { BiHide } from "react-icons/bi";
import { MdReportGmailerrorred } from "react-icons/md";

interface CommentItemMenuProps {
    menuRef: React.RefObject<HTMLDivElement | null>;
    menuPosition: { top: number; left: number };
    isOwner: boolean;
    isDeleting: boolean;
    onHide: (e: React.MouseEvent) => void;
    onReport: (e: React.MouseEvent) => void;
    onEdit: (e: React.MouseEvent) => void;
    onDelete: (e: React.MouseEvent) => void;
}

export default function CommentItemMenu({
    menuRef,
    menuPosition,
    isOwner,
    isDeleting,
    onHide,
    onReport,
    onEdit,
    onDelete,
}: CommentItemMenuProps) {
    if (typeof window === 'undefined') return null;

    return createPortal(
        <div
            ref={menuRef}
            className="flex flex-col bg-[rgba(30,30,40,0.95)] border border-white/15 rounded-lg overflow-hidden min-w-fit shadow-lg backdrop-blur-md"
            style={{
                position: 'absolute',
                top: `${menuPosition.top}px`,
                left: `${menuPosition.left}px`,
                zIndex: 9999,
            }}
        >
            <button
                className="flex items-center gap-2 w-full min-w-[120px] px-4 py-3 bg-transparent border-none text-white/80 font-['Google_Sans',sans-serif] text-sm text-left cursor-pointer transition-all duration-200 border-b border-white/5 hover:bg-pink-500/10 hover:text-pink-500 active:bg-pink-500/20"
                onClick={onHide}
            >
                <BiHide size={18} className="flex-shrink-0" />
                Hide
            </button>
            <button
                className="flex items-center gap-2 w-full min-w-[120px] px-4 py-3 bg-transparent border-none text-white/80 font-['Google_Sans',sans-serif] text-sm text-left cursor-pointer transition-all duration-200 border-b border-white/5 hover:bg-pink-500/10 hover:text-pink-500 active:bg-pink-500/20"
                onClick={onReport}
            >
                <MdReportGmailerrorred size={18} className="flex-shrink-0" />
                Report
            </button>
            {isOwner && (
                <>
                    <button
                        className="flex items-center gap-2 w-full min-w-[120px] px-4 py-3 bg-transparent border-none text-white/80 font-['Google_Sans',sans-serif] text-sm text-left cursor-pointer transition-all duration-200 border-b border-white/5 hover:bg-pink-500/10 hover:text-pink-500 active:bg-pink-500/20"
                        onClick={onEdit}
                    >
                        <MdEdit size={18} className="flex-shrink-0" />
                        Edit
                    </button>
                    <button
                        className="flex items-center gap-2 w-full min-w-[120px] px-4 py-3 bg-transparent border-none text-[rgba(255,107,107,0.9)] font-['Google_Sans',sans-serif] text-sm text-left cursor-pointer transition-all duration-200 hover:bg-red-500/10 hover:text-red-500 active:bg-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={onDelete}
                        disabled={isDeleting}
                    >
                        <MdDelete size={18} className="flex-shrink-0" />
                        {isDeleting ? 'Deleting...' : 'Delete'}
                    </button>
                </>
            )}
        </div>,
        document.body
    );
}
