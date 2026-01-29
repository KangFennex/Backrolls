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
            <span className="post-card__dropdown-item">
                <MdDataSaverOn size={18} />
                <button onClick={onSave}>
                    Save
                </button>
            </span>
            <span className="post-card__dropdown-item">
                <BiHide size={18} />
                <button onClick={onHide}>
                    Hide
                </button>
            </span>
            <span className="post-card__dropdown-item">
                <MdReportGmailerrorred size={18} />
                <button onClick={onReport}>
                    Report
                </button>
            </span>
            {isOwner && (
                <>
                    <span className="post-card__dropdown-item">
                        <MdEdit size={18} />
                        <button onClick={onEdit}>
                            Edit
                        </button>
                    </span>
                    <span className="post-card__dropdown-item post-card__dropdown-item--danger">
                        <MdDelete size={18} />
                        <button
                            onClick={onDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting ? 'Deleting...' : 'Delete'}
                        </button>
                    </span>
                </>
            )}
        </div>,
        document.body
    );
}
