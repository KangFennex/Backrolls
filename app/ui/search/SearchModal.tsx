'use client';

import "./search.scss";
import CardWrapper from "./searchCards";
import { Quote } from "./searchCards";

type SearchModalProps = {
    closeSearchModal: () => void;
    searchResults: Quote[];
};

export default function SearchModal({
    searchResults
}: SearchModalProps) {
    return (
        <div className="search-modal">
            <div className="search-modal__content absolute top-14 left-0 md:left-4 right-0 w-full max-h-[80vh] bg-[#222533] md:w-100 lg:w-160 md:m-auto md:rounded-bl-md md:rounded-br-md pb-8 md:border-b-[5px] md:border-b-[hsl(196,79%,65%)] overflow-y-auto">
                
                {/* Shimmer element */}
                <div className="hidden md:block absolute bottom-0 left-0 h-[5px] w-full overflow-hidden">
                    <div className="shimmer-effect absolute h-full w-1/2 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"></div>
                </div>
                <CardWrapper searchResults={searchResults} />
            </div>
        </div>
    );
}