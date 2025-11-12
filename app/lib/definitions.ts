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
    user_id: string;
    is_approved: boolean;
    vote_count: number;
    share_count: number;
    // Optional relationship to contexts
    contexts?: QuoteContext[];
};

export type QuoteContext = {
    id: string;
    quote_id: string;
    context: string;
    submitted_by: string | null;
    submitted_at: string;
    is_verified: boolean;
    created_at: string;
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
    onClick?: () => void;
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

export interface QuoteCardProps {
    quote: Quote;
    variant?: 'full' | 'compact';
    onRemoveFavorite?: (quote_id: string) => void;
    onClick?: () => void;
    index?: number;
    isMainPage?: boolean;
}

export interface BackrollHeaderProps {
    quote: Quote;
}

export interface BackrollContentProps {
    quoteText: string;
    speaker: string;
    maxLength?: number;
    onClick?: () => void;
}

export interface BackrollActionsProps {
    quoteId: string;
    quoteText: string;
    currentVoteCount: number;
    isCompact: boolean;
    expanded: boolean;
    onExpandClick: () => void;
    onRemoveFavorite?: (quote_id: string) => void;
}

export interface BackrollDetailsProps {
    quote: Quote;
    expanded: boolean;
}

export interface SplitButtonProps {
    label: string;
    selectedValue: string | number | null;
    options: { value: string | number; label: string; }[];
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

// Define props for Series components

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

export interface SeriesPageServerProps {
    searchParams: Promise<{
        category?: string;
        series?: string;
        season?: string;
        episode?: string;
    }>
}

export interface SeriesClientProps {
    initialQuotes: Quote[];
    initialFilters: {
        category?: string;
        series?: string;
        season?: number;
        episode?: number;
    }
}

export interface SeriesPageProps {
    searchParams: Promise<{
        category?: string;
        series?: string;
        season?: string;
        episode?: string;
    }>
}

// Define props for RandomServer and RandomClient components
export interface RandomServerProps {
    limit: number;
}

export interface RandomClientProps {
    randomQuotes: Quote[];
}

export interface RandomPageProps {
    searchParams: Promise<{
        limit?: string;
    }>
}

export interface RandomPageServerProps {
    searchParams: Promise<{
        limit?: string;
    }>
}

// Define props for PageContainer and PageComponentContainer components
export interface PageContainerProps {
    children: React.ReactNode;
}

export interface PageComponentContainerProps {
    children: React.ReactNode;
    variant?: 'mosaic' | 'list';
}

// Define props for FilterDrawer and its subcomponents
export interface FilterDrawerProps {
    open: boolean;
    onClose: () => void;
}

export interface FilterHeaderProps {
    onClose: () => void;
}

export interface FilterControlsProps {
    seriesCategory: string;
    selectedSeries: string | null;
    selectedSeason: number | null;
    selectedEpisode: number | null;
    onCategoryChange: (category: string | number | null) => void;
    onSeriesChange: (series: string | number | null) => void;
    onSeasonChange: (season: string | number | null) => void;
    onEpisodeChange: (episode: string | number | null) => void;
}

export interface FilterActionsProps {
    seriesCategory: string;
    hasActiveFilters: boolean;
    onApplyFilters: () => void;
    onClearFilters: () => void;
}

export interface SeriesFilterProps {
    onClose?: () => void;
    className?: string;
}

// Quiz

export interface QuizQuestion {
    id: string;
    quote: string;
    correctSpeaker: string;  // Just the name, simpler than nested object
    series: string;
    season: number;
    episode: number;
    options: string[];  // Array of speaker names (shuffled, includes correct answer)
}