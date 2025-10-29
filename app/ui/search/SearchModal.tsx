'use client';

import "./searchCards.scss";
import SearchResults from "./searchCards";
import { SearchCardsSkeleton } from "../skeletons";
import { useSearchContext } from "../../context/SearchContext";

export default function SearchModal() {
    const { searchResults, loading, handleSetBackroll } = useSearchContext();

    return (
        <div className="search-modal z-50 mt-14">
            <div className="search-modal__content">
                {loading ? (
                    <SearchCardsSkeleton />
                ) : (
                    <SearchResults
                        searchResults={searchResults}
                        handleSetBackroll={handleSetBackroll}
                    />
                )}
            </div>
        </div>
    );
}