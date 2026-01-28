'use client';

import "@/app/scss/components/FilterActions.scss";
import { IoMdRefresh } from "react-icons/io";
import { IoCheckmark } from "react-icons/io5";

interface FilterActionsProps {
    onReset: () => void;
    onApply: () => void;
}

export default function FilterActions({ onReset, onApply }: FilterActionsProps) {
    return (
        <div className="filter-actions">
            <button
                onClick={onReset}
                className="filter-actions__btn filter-actions__btn--reset"
            >
                <IoMdRefresh />
                <span>Reset</span>
            </button>
            <button
                onClick={onApply}
                className="filter-actions__btn filter-actions__btn--apply"
            >
                <IoCheckmark />
                <span>Apply</span>
            </button>
        </div>
    );
}
