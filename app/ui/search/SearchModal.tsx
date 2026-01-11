'use client';

import "@/app/scss/search/searchModal.scss";
import SearchResults from "./searchCards";
import { SearchCardsSkeleton } from "../skeletons";
import { useSearchContext } from "../../context/SearchContext";

export default function SearchModal() {
    const { searchResults, loading, handleSetBackroll } = useSearchContext();

    return (
        <div className="search-modal">
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