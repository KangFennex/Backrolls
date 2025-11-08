// Export all hooks from their individual files
export { useAuth } from './useAuth';
export { useQuotes } from './useQuotes';
export { useSeriesFiltering } from './useSeriesFiltering';
export { useSeriesSeasons } from './useSeriesSeasons';
export { useRainbowColors } from './useRainbowColors';
export { useScrollDirection } from './useScrollDirection';
export { getBackrollCardBackground } from './useBackrollCardBackground';
export { usePlaceholderLogic } from './usePlaceholderLogic';

// TanStack Query hooks - Ready for series and other components
// Note: Random buttons use React Server Components for optimal performance
// export { useRandomQuotes } from './useRandomQuotes'; 
export { useHotQuotes } from './useHotQuotes';
export { useFreshQuotes } from './useFreshQuotes';
export { useWorkroomQuotes } from './useWorkroomQuotes';