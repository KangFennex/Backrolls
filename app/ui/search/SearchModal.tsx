'use client';

import "./searchCards.scss";
import CardWrapper from "./searchCards";
import { Quote } from "./searchCards";
import { Suspense } from "react";
import { SearchCardsSkeleton } from "../skeletons";
import { SearchModalProps } from "../../lib/definitions";

export default function SearchModal({
    searchResults,
    loading,
    clearSearchInput
}: SearchModalProps) {
    return (
        <div className="search-modal z-40">
            <div className="search-modal__content">
                {loading ? (
                <SearchCardsSkeleton />
                ) : (
                    <CardWrapper 
                    searchResults={searchResults} clearSearchInput={clearSearchInput} />
                )}
            </div>
        </div>
    );
}