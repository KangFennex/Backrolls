'use client';

import { createPortal } from 'react-dom';
import { MdDataSaverOn, MdEdit, MdDelete } from "react-icons/md";
import { BiHide } from "react-icons/bi";
import { MdReportGmailerrorred } from "react-icons/md";
import '@/app/scss/components/DropdownMenu.scss';

interface CommentItemMenuProps {
    menuRef: React.RefObject<HTMLDivElement | null>;
    menuPosition: { top: number; left: number };
    isOwner: boolean;
    isDeleting: boolean;
    onSave: (e: React.MouseEvent) => void;
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
    onSave,
    onHide,
    onReport,
    onEdit,
    onDelete,
}: CommentItemMenuProps) {
    if (typeof window === 'undefined') return null;

    return createPortal(
        <div
            ref={menuRef}
            className="post-card__dropdown"
            style={{
                position: 'fixed',
                top: `${menuPosition.top}px`,
                left: `${menuPosition.left}px`,
            }}
        >
            <button className="post-card__dropdown-item" onClick={onSave}>
                <MdDataSaverOn size={18} />
                Save
            </button>
            <button className="post-card__dropdown-item" onClick={onHide}>
                <BiHide size={18} />
                Hide
            </button>
            <button className="post-card__dropdown-item" onClick={onReport}>
                <MdReportGmailerrorred size={18} />
                Report
            </button>
            {isOwner && (
                <>
                    <button className="post-card__dropdown-item" onClick={onEdit}>
                        <MdEdit size={18} />
                        Edit
                    </button>
                    <button
                        className="post-card__dropdown-item post-card__dropdown-item--danger"
                        onClick={onDelete}
                        disabled={isDeleting}
                    >
                        <MdDelete size={18} />
                        {isDeleting ? 'Deleting...' : 'Delete'}
                    </button>
                </>
            )}
        </div>,
        document.body
    );
}
