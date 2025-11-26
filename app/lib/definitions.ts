import { z } from 'zod';
import { DefaultSession } from 'next-auth';

// =============================================================================
// AUTHENTICATION & USER TYPES
// =============================================================================

/**
 * Base user type for authentication (rename to avoid conflict)
 */
export type AppUser = {
    id: string;
    username: string;
    email: string;
    password: string;
};

/**
 * Extended user profile with optional social/OAuth fields
 */
export interface ExtendedUser {
    id?: string;
    username?: string;
    email?: string | null;
    name?: string | null;
    image?: string | null;
    remember?: boolean;
}

/**
 * Form validation schema for user signup
 */
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

/**
 * Error structure for signup form validation
 */
export interface SignupFormErrors {
    username?: string[];
    email?: string[];
    password?: string[];
    general?: string;
}

// =============================================================================
// QUOTE DATA TYPES
// =============================================================================

/**
 * Core quote entity representing a memorable line from Drag Race
 */
export type Quote = {
    id: string | number;
    quote_text: string;
    region: string;
    series: string;
    series_code: string;
    season: number;
    episode: number;
    episode_title?: string;
    speaker: string;
    type: string;
    timestamp: string;
    air_date: string;
    user_id: string;
    is_approved: boolean;
    vote_count: number;
    share_count: number;
    created_at?: string;
    // optional original language quote_text if not in English
    original_language?: string;
    // Optional relationship to contexts
    contexts?: QuoteContext[];
};

/**
 * Additional context for quotes (background story, scene description, etc.)
 */
export type QuoteContext = {
    id: string;
    quote_id: string;
    context: string;
    submitted_by: string | null;
    submitted_at: string;
    is_verified: boolean;
    created_at: string;
};

/**
 * Detailed information for favorited quotes
 */
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

// =============================================================================
// COMPONENT PROPS - CARD COMPONENTS
// =============================================================================

/**
 * Props for card wrapper that contains multiple quote cards
 */
export type CardWrapperProps = {
    searchResults: Quote[];
    clearSearchInput?: () => void;
    handleSetBackroll: (id: string) => void;
};

/**
 * Basic card props for simplified quote display
 */
export type CardProps = {
    id: string;
    quote: string;
    speaker: string;
    season: number;
    episode: number;
    onClick?: () => void;
};

/**
 * Props for individual quote card with full functionality
 */
export interface QuoteCardProps {
    quote: Quote;
    variant?: 'full' | 'compact';
    onRemoveFavorite?: (quote_id: string) => void;
    onClick?: () => void;
    index?: number;
    mosaic?: boolean;
}

// =============================================================================
// COMPONENT PROPS - BACKROLL COMPONENTS
// =============================================================================

/**
 * Header section of backroll card
 */
export interface BackrollHeaderProps {
    quote: Quote;
}

/**
 * Content section displaying quote text and speaker
 */
export interface BackrollContentProps {
    quoteText: string;
    speaker: string;
    maxLength?: number;
    onClick?: () => void;
}

/**
 * Action buttons for backroll (vote, share, expand, etc.)
 */
export interface BackrollActionsProps {
    quoteId: string;
    quoteText: string;
    currentVoteCount: number;
    isCompact: boolean;
    expanded: boolean;
    onExpandClick: () => void;
    onRemoveFavorite?: (quote_id: string) => void;
    onClick: () => void;
}

/**
 * Detailed information section that expands/collapses
 */
export interface BackrollDetailsProps {
    quote: Quote;
    expanded: boolean;
}

/**
 * Display component for backroll search results
 */
export type BackrollCardProps = {
    displayResults: string[];
}

// =============================================================================
// COMPONENT PROPS - NAVIGATION & SEARCH
// =============================================================================

/**
 * Navigation component props
 */
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

/**
 * Search modal component props
 */
export type SearchModalProps = {
    searchResults: Quote[];
    loading: boolean;
    handleSetBackroll: (id: string) => void;
};

/**
 * Search component props
 */
export type SearchProps = {
    searchModal: boolean;
    handleInputChange: (input: string) => void;
    clearSearchInputChange: () => void;
    searchInput: string | null;
    handleSetBackroll: (id: string) => void;
    handleSearchSubmit: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

// =============================================================================
// COMPONENT PROPS - FILTERS & DROPDOWNS
// =============================================================================

/**
 * Split button dropdown component for filter selection
 */
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

/**
 * Series filter component props
 */
export interface SeriesFilterProps {
    onClose?: () => void;
    className?: string;
}

// =============================================================================
// COMPONENT PROPS - FILTER DRAWER
// =============================================================================

/**
 * Main filter drawer component props
 */
export interface FilterDrawerProps {
    open: boolean;
    onClose: void;
}

/**
 * Filter drawer header component props
 */
export interface FiltersHeaderProps {
    onClose: void;
}

export interface FiltersChipProps {
    label: string;
    onClick: () => void;
    color?: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
}

/**
 * Filter controls within the drawer
 */
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

/**
 * Filter action buttons (apply, clear)
 */
export interface FilterActionsProps {
    seriesCategory: string;
    hasActiveFilters: boolean;
    onApplyFilters: () => void;
    onClearFilters: () => void;
}

// =============================================================================
// CONTEXT & PAGE PROPS - SERIES
// =============================================================================

/**
 * Context for managing series filtering state
 */
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

/**
 * Server props for series pages
 */
export interface SeriesPageServerProps {
    searchParams: Promise<{
        region?: string;
        series?: string;
        season?: string;
        episode?: string;
    }>
}

/**
 * Client props for series pages
 */
export interface SeriesClientProps {
    initialQuotes: Quote[];
    initialFilters: {
        region?: string;
        series?: string;
        season?: number;
        episode?: number;
    }
}

/**
 * Series page component props
 */
export interface SeriesPageProps {
    searchParams: Promise<{
        region?: string;
        series?: string;
        season?: string;
        episode?: string;
    }>
}

// =============================================================================
// PAGE PROPS - RANDOM QUOTES
// =============================================================================

/**
 * Server props for random quotes page
 */
export interface RandomServerProps {
    limit: number;
}

/**
 * Client props for random quotes page
 */
export interface RandomClientProps {
    randomQuotes: Quote[];
}

/**
 * Random page component props
 */
export interface RandomPageProps {
    searchParams: Promise<{
        limit?: string;
    }>
}

/**
 * Server props for random page
 */
export interface RandomPageServerProps {
    searchParams: Promise<{
        limit?: string;
    }>
}

// =============================================================================
// LAYOUT & CONTAINER PROPS
// =============================================================================

/**
 * Main page container props
 */
export interface PageContainerProps {
    children: React.ReactNode;
}

/**
 * Component container with layout variants
 */
export interface PageComponentContainerProps {
    children: React.ReactNode;
    variant?: 'mosaic' | 'list';
}

// =============================================================================
// QUIZ FEATURE TYPES
// =============================================================================

/**
 * Quiz question structure for "Who Said It?" game
 */
export interface QuizQuestion {
    id: string;
    quote: string;
    correctSpeaker: string;  // Just the name, simpler than nested object
    series: string;
    season: number;
    episode: number;
    options: string[];  // Array of speaker names (shuffled, includes correct answer)
}

// =============================================================================
// NEXT-AUTH TYPE EXTENSIONS
// =============================================================================

import "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            username?: string;
            email?: string | null;
            name?: string | null;
            image?: string | null;
        };
        remember?: boolean;
    }

    interface User {
        id: string;
        username?: string;
        email?: string | null;
        name?: string | null;
        image?: string | null;
        remember?: boolean;
    }

    interface JWT {
        username?: string;
        remember?: boolean;
    }
}