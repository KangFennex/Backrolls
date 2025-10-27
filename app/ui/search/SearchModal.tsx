'use client';

import "./searchCards.scss";
import SearchResults from "./searchCards";
import { SearchCardsSkeleton } from "../skeletons";
import { SearchModalProps } from "../../lib/definitions";

export default function SearchModal({
    searchResults,
    loading,
    handleSetBackroll,
}: SearchModalProps) {
    return (
        <div className="search-modal z-50 mt-14">
            <div className="search-modal__content">
                {loading ? (
                    <SearchCardsSkeleton />
                ) : (
                    <SearchResults
                        searchResults={searchResults} handleSetBackroll={handleSetBackroll} />
                )}
            </div>
        </div>
    );
}