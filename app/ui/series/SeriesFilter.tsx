'use client'

import * as React from 'react';
import { useSeriesContext } from '../../context/SeriesContext';
import { useSeriesFiltering } from '../../lib/hooks';
import { IoClose } from "react-icons/io5";
import SplitButton from './components/SplitButton';

export default function SeriesFilter() {
    const {
        seriesCategory,
        selectedSeries,
        selectedSeason,
        selectedEpisode,
        setSeriesCategory,
        setSelectedSeries,
        setSelectedSeason,
        setSelectedEpisode,
        clearFilters
    } = useSeriesContext();

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

    const availableSeries = getSeriesByCategory(seriesCategory);

    const seriesOptions = availableSeries.map(series => ({
        value: series.name,
        label: series.name
    }));

    const seasonOptions = selectedSeries ? getSeasonOptions(selectedSeries) : [];

    const episodeOptions = selectedSeries && selectedSeason
        ? getEpisodeOptions(selectedSeries, selectedSeason)
        : [];

    // Event handlers
    const handleCategoryChange = (category: string | number | null) => {
        if (typeof category === 'string') {
            console.log('🔄 Category change handler called with:', category);
            setSeriesCategory(category);
        }
    };

    const handleSeriesChange = (series: string | number | null) => {
        setSelectedSeries(typeof series === 'string' ? series : null);
    };

    const handleSeasonChange = (season: string | number | null) => {
        setSelectedSeason(typeof season === 'number' ? season : null);
    };

    const handleEpisodeChange = (episode: string | number | null) => {
        setSelectedEpisode(typeof episode === 'number' ? episode : null);
    };

    return (
        <div className="series-filter space-y-6 w-full max-w-4xl">
            {/* Filter Controls */}
            <div className="flex flex-row gap-4 justify-center items-center">
                {/* Category Split Button */}
                <SplitButton
                    label="Category"
                    selectedValue={seriesCategory}
                    options={categoryOptions}
                    onSelect={handleCategoryChange}
                    backgroundColor="#f8bbd9"
                    hoverColor="#f5a3c7"
                    placeholder="Category"
                />

                {/* Series Split Button */}
                <SplitButton
                    label="Series"
                    selectedValue={selectedSeries}
                    options={seriesOptions}
                    onSelect={handleSeriesChange}
                    backgroundColor="#d6b8ff"
                    hoverColor="#c9a3ff"
                    placeholder={`${seriesCategory === "main-series" ? "RuPaul's Drag Race" : "Series"}`}
                    seriesCategory={seriesCategory}
                />

                {/* Season Split Button */}
                <SplitButton
                    label="Season"
                    selectedValue={selectedSeason}
                    options={seasonOptions}
                    onSelect={handleSeasonChange}
                    onMainClick={() => handleSeasonChange(null)}
                    backgroundColor="#b8f2cd"
                    hoverColor="#a3efbb"
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
                    onMainClick={() => handleEpisodeChange(null)}
                    backgroundColor="#ffd4b8"
                    hoverColor="#ffc9a3"
                    allowClear={true}
                    clearLabel="All Episodes"
                    placeholder="Episodes"
                />

                {/* Clear filters button */}
                <div
                    className='flex items-center justify-center mt-6 sm:mt-0 cursor-pointer'
                    onClick={clearFilters}
                >
                    <IoClose size={20} color="red" />
                </div>
            </div>
        </div>
    );
}