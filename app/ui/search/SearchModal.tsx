'use client';

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
            <div className="search-modal__content absolute top-14 left-0 right-0 w-full h-full bg-[#222533] flex items-center justify-center md:w-180 md:m-auto md:h-fit md:min-h-60 md:rounded-bl-md md:rounded-br-md pb-8">
                <CardWrapper searchResults={searchResults} />
            </div>
        </div>
    );
}