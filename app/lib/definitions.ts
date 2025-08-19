export type Quote = {
    id: string | number;
    quote_text: string;
    speaker: string;
    season: number;
    episode: number;
};

export type CardWrapperProps = {
    searchResults: Quote[];
    clearSearchInput?: () => void;
};

export type CardProps = {
    quote: string;
    speaker: string;
    season: number;
    episode: number;
    onClick: () => void;
};

export type SearchModalProps = {
    searchResults: Quote[];
    loading: boolean;
    clearSearchInput?: () => void;
};
