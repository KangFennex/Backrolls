'use client'

import * as React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSeriesFiltering } from '../../lib/hooks';
import { IoClose } from "react-icons/io5";
import SplitButton from '../series/components/SplitButton';

interface SeriesFilterProps {
    onClose?: () => void;
    className?: string;
}

export default function SeriesFilter({ onClose, className = '' }: SeriesFilterProps) {
    const router = useRouter();

    // Local state for filter selections
    const [seriesCategory, setSeriesCategory] = useState<string | null>(null);
    const [selectedSeries, setSelectedSeries] = useState<string | null>(null);
    const [selectedSeason, setSelectedSeason] = useState<number | null>(null);
    const [selectedEpisode, setSelectedEpisode] = useState<number | null>(null);

    const {
        getSeriesByCategory,
        getSeasonOptions,
        getEpisodeOptions,
    } = useSeriesFiltering();

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
        const params = new URLSearchParams();

        if (seriesCategory) {
            params.set('category', seriesCategory);
        }

        if (selectedSeries) {
            params.set('series', selectedSeries);
        }

        if (selectedSeason !== null) {
            params.set('season', selectedSeason.toString());
        }

        if (selectedEpisode !== null) {
            params.set('episode', selectedEpisode.toString());
        }

        // Navigate to series page with filters
        const url = `/series${params.toString() ? `?${params.toString()}` : ''}`;
        router.push(url);

        // Close the filter component if onClose is provided
        if (onClose) {
            onClose();
        }
    };

    // Event handlers
    const handleCategoryChange = (category: string | number | null) => {
        if (typeof category === 'string') {
            console.log('🔄 Category change handler called with:', category);
            setSeriesCategory(category);
            // Reset dependent selections when category changes
            setSelectedSeries(null);
            setSelectedSeason(null);
            setSelectedEpisode(null);
        }
    };

    const handleSeriesChange = (series: string | number | null) => {
        setSelectedSeries(typeof series === 'string' ? series : null);
        // Reset dependent selections when series changes
        setSelectedSeason(null);
        setSelectedEpisode(null);
    };

    const handleSeasonChange = (season: string | number | null) => {
        setSelectedSeason(typeof season === 'number' ? season : null);
        // Reset episode when season changes
        setSelectedEpisode(null);
    };

    const handleEpisodeChange = (episode: string | number | null) => {
        setSelectedEpisode(typeof episode === 'number' ? episode : null);
    };

    const clearFilters = () => {
        setSeriesCategory(null);
        setSelectedSeries(null);
        setSelectedSeason(null);
        setSelectedEpisode(null);
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
                    onClick={clearFilters}
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