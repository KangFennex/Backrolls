import { z } from 'zod'

export type User = {
    id: string;
    username: string;
    email: string;
    password: string;
};

export interface ExtendedUser {
    id?: string;
    username?: string;
    email?: string | null;
    name?: string | null;
    image?: string | null;
}

export interface FavoriteQuoteDetails {
    id: string | number;
    quote_text: string;
    created_at: string;
    series: string;
    season: number;
    episode: number;
    timestamp: string;
    speaker: string;
    context: string;
    vote_count: number;
    share_count: number;
}

export interface SignupFormErrors {
    username?: string[];
    email?: string[];
    password?: string[];
    general?: string;
}

export const SignupFormSchema = z.object({
    username: z
        .string()
        .min(4, { message: 'Username must be at least 4 characters long.' })
        .trim(),
    email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
    password: z
        .string()
        .min(8, { message: 'Should be at least 8 characters long' })
        .regex(/[a-zA-Z]/, { message: 'Should contain at least one letter.' })
        .regex(/[0-9]/, { message: 'Should contain at least one number.' })
        .regex(/[^a-zA-Z0-9]/, {
            message: 'Should contain at least one special character.',
        })
        .trim(),
})

export type Quote = {
    id: string | number;
    quote_text: string;
    category: string;
    series: string;
    speaker: string;
    season: number;
    episode: number;
    timestamp: string;
    context: string;
    user_id: string;
    is_approved: boolean;
    vote_count: number;
    share_count: number;
};


export type CardWrapperProps = {
    searchResults: Quote[];
    clearSearchInput?: () => void;
    handleSetBackroll: (id: string) => void;
};

export type CardProps = {
    id: string;
    quote: string;
    speaker: string;
    season: number;
    episode: number;
    onClick: () => void;
};

export type NavProps = {
    menu: boolean;
    setMenu: React.Dispatch<React.SetStateAction<boolean>>;
    searchModal: boolean;
    openSearchModal: () => void;
    handleInputChange: (input: string) => void;
    clearSearchInput: () => void;
    searchInput: string,
    handleSearchSubmit: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export type SearchModalProps = {
    searchResults: Quote[];
    loading: boolean;
    handleSetBackroll: (id: string) => void;
};

export type SearchProps = {
    searchModal: boolean;
    handleInputChange: (input: string) => void;
    clearSearchInputChange: () => void;
    searchInput: string | null;
    handleSetBackroll: (id: string) => void;
    handleSearchSubmit: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export type BackrollCardProps = {
    displayResults: string[];
}

export type SeriesContextType = {
    seriesCategory: string;
    selectedSeries: string | null;
    selectedSeason: number | null;
    selectedEpisode: number | null;
    setSeriesCategory: (category: string) => void;
    setSelectedSeries: (series: string | null) => void;
    setSelectedSeason: (season: number | null) => void;
    setSelectedEpisode: (episode: number | null) => void;
    clearFilters: () => void;
}

export interface SplitButtonProps {
    label: string;
    selectedValue: string | number | null;
    seriesCategory?: string;
    onSelect: (value: string | number | null) => void;
    onMainClick?: () => void;
    backgroundColor?: string;
    hoverColor?: string;
    allowClear?: boolean;
    clearLabel?: string;
    placeholder?: string;
    disabled?: boolean;
}
