'use client'

import * as React from 'react';
import { useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useBackrollsStore } from '../../store/backrollsStore';
import { useSeriesFiltering } from '../../lib/hooks';
import { IoClose } from "react-icons/io5";
import SplitButton from './components/SplitButton';
import { SeriesFilterProps } from '../../lib/definitions';

export default function SeriesFilter({ onClose, className = '' }: SeriesFilterProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    // Get filter state and actions from store
    const {
        filters,
        setFilters,
        clearFilters,
        initFiltersFromUrl,
        updateUrlFromFilters,
    } = useBackrollsStore();

    const { seriesCategory, selectedSeries, selectedSeason, selectedEpisode } = filters;

    const {
        getSeriesByCategory,
        getSeasonOptions,
        getEpisodeOptions,
    } = useSeriesFiltering();

    // Initialize filters from URL on component mount (URL takes precedence)
    useEffect(() => {
        const hasUrlParams = searchParams.has('category') || searchParams.has('series') ||
            searchParams.has('season') || searchParams.has('episode');

        if (hasUrlParams) {
            // URL has precedence - update store to match
            initFiltersFromUrl(searchParams);
        } else {
            // No URL params - update URL to match store state if filters are active
            const storeFilters = useBackrollsStore.getState().filters;
            const hasActiveStoreFilters = storeFilters.selectedSeries ||
                storeFilters.selectedSeason ||
                storeFilters.selectedEpisode ||
                storeFilters.seriesCategory !== 'main-series';

            if (hasActiveStoreFilters) {
                updateUrlFromFilters(router, pathname);
            }
        }
    }, [searchParams, initFiltersFromUrl, updateUrlFromFilters, router, pathname]);

    // Prepare options for each button
    const categoryOptions = [
        { value: 'main-series', label: 'Main Series' },
        { value: 'all-stars', label: 'All Stars' },
        { value: 'international', label: 'International' },
        { value: 'spin-off', label: 'Spin Off' }
    ];

    const availableSeries = seriesCategory ? getSeriesByCategory(seriesCategory) : [];

    const seriesOptions = availableSeries.map(series => ({
        value: series.name,
        label: series.name
    }));

    const seasonOptions = selectedSeries ? getSeasonOptions(selectedSeries) : [];

    const episodeOptions = selectedSeries && selectedSeason
        ? getEpisodeOptions(selectedSeries, selectedSeason)
        : [];

    // Function to apply filters and navigate
    const applyFilters = () => {
        // Update URL from current store state
        updateUrlFromFilters(router, '/series');

        // Close the filter component if onClose is provided
        if (onClose) {
            onClose();
        }
    };

    // Event handlers using store
    const handleCategoryChange = (category: string | number | null) => {
        if (typeof category === 'string') {
            console.log('🔄 Category change handler called with:', category);

            // Handle main-series auto-selection
            let newSeries = null;
            if (category === 'main-series') {
                newSeries = "RuPaul's Drag Race";
            }

            setFilters({
                seriesCategory: category,
                selectedSeries: newSeries,
                selectedSeason: null,
                selectedEpisode: null,
            });
        }
    };

    const handleSeriesChange = (series: string | number | null) => {
        setFilters({
            selectedSeries: typeof series === 'string' ? series : null,
            selectedSeason: null,
            selectedEpisode: null,
        });
    };

    const handleSeasonChange = (season: string | number | null) => {
        setFilters({
            selectedSeason: typeof season === 'number' ? season : null,
            selectedEpisode: null,
        });
    };

    const handleEpisodeChange = (episode: string | number | null) => {
        setFilters({
            selectedEpisode: typeof episode === 'number' ? episode : null,
        });
    };

    const handleClearFilters = () => {
        clearFilters();
        // Update URL to reflect cleared state
        updateUrlFromFilters(router, pathname);
    };

    return (
        <div className={`series-filter flex flex-col space-y-4 w-full max-w-4xl ${className}`}>
            {/* Filter Controls */}
            <div className="flex flex-row gap-2 sm:gap-4 justify-center items-center flex-wrap">

                {/* Category Split Button */}
                <SplitButton
                    label="Category"
                    selectedValue={seriesCategory}
                    options={categoryOptions}
                    onSelect={handleCategoryChange}
                    placeholder="Category"
                />

                {/* Series Split Button */}
                <SplitButton
                    label="Series"
                    selectedValue={selectedSeries}
                    options={seriesOptions}
                    onSelect={handleSeriesChange}
                    placeholder={`${seriesCategory === "main-series" ? "RuPaul's Drag Race" : "Series"}`}
                    seriesCategory={seriesCategory || undefined}
                />

                {/* Season Split Button */}
                <SplitButton
                    label="Season"
                    selectedValue={selectedSeason}
                    options={seasonOptions}
                    onSelect={handleSeasonChange}
                    allowClear={true}
                    clearLabel="All Seasons"
                    placeholder="Seasons"
                />

                {/* Episode Split Button */}
                <SplitButton
                    label="Episode"
                    selectedValue={selectedEpisode}
                    options={episodeOptions}
                    onSelect={handleEpisodeChange}
                    allowClear={true}
                    clearLabel="All Episodes"
                    placeholder="Episodes"
                />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-row gap-3 justify-center items-center flex-wrap">
                {/* Apply Filters Button */}
                <button
                    onClick={applyFilters}
                    disabled={!seriesCategory}
                    className={`
                        px-4 sm:px-6 py-2 rounded-md font-medium transition-all duration-200 text-sm sm:text-base
                        ${seriesCategory
                            ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
                            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        }
                    `}
                >
                    Apply Filters
                </button>

                {/* Clear Filters Button */}
                <button
                    onClick={handleClearFilters}
                    className="px-4 sm:px-6 py-2 rounded-md font-medium bg-gray-600 hover:bg-gray-700 text-white transition-all duration-200 shadow-md hover:shadow-lg text-sm sm:text-base"
                >
                    Clear All
                </button>

                {/* Close Button */}
                {onClose && (
                    <div
                        className='flex items-center justify-center cursor-pointer p-2 hover:bg-gray-800 rounded-full transition-colors duration-200'
                        onClick={onClose}
                        title="Close filter"
                    >
                        <IoClose size={20} color="red" />
                    </div>
                )}
            </div>
        </div>
    );
}