'use client'

import { DragRaceSeries } from '@/app/lib/newRepertoire';
import { FaExpandAlt } from "react-icons/fa";

interface GuessFiltersProps {
    selectedRegion: string;
    selectedSeries: string;
    selectedSeason: number | null;
    selectedEpisode: number | null;
    filteredSeries: DragRaceSeries[];
    availableSeasons: number[];
    availableEpisodes: number[];
    useFilters: boolean;
    onRegionChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    onSeriesChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    onSeasonChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    onEpisodeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    onClearFilters: () => void;
    onExpandClick: () => void;
}

const selectStyles = {
    WebkitAppearance: 'none' as const,
    MozAppearance: 'none' as const,
    appearance: 'none' as const,
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='white' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat' as const,
    backgroundPosition: 'right 0.75rem center',
    paddingRight: '2.5rem'
};

export default function GuessFilters({
    selectedRegion,
    selectedSeries,
    selectedSeason,
    selectedEpisode,
    filteredSeries,
    availableSeasons,
    availableEpisodes,
    useFilters,
    onRegionChange,
    onSeriesChange,
    onSeasonChange,
    onEpisodeChange,
    onClearFilters,
    onExpandClick
}: GuessFiltersProps) {
    return (
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 mb-6 px-4">
            {/* Region Filter */}
            <select
                value={selectedRegion}
                onChange={onRegionChange}
                className="px-2 md:px-4 py-2 text-sm md:text-base bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent cursor-pointer transition-all duration-200 hover:bg-gray-750 hover:border-pink-500"
                style={selectStyles}
            >
                <option value="">All Regions</option>
                <option value="americas">Americas</option>
                <option value="europe">Europe</option>
                <option value="asia">Asia</option>
                <option value="oceania">Oceania</option>
            </select>

            {/* Series Filter */}
            <select
                value={selectedSeries}
                onChange={onSeriesChange}
                disabled={!selectedRegion}
                className="px-2 md:px-4 py-2 text-sm md:text-base bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent cursor-pointer transition-all duration-200 hover:bg-gray-750 hover:border-pink-500 disabled:opacity-50 disabled:cursor-not-allowed max-w-[180px] md:max-w-none"
                style={selectStyles}
            >
                <option value="">All Series</option>
                {filteredSeries.map(s => (
                    <option key={s.code} value={s.code}>{s.name}</option>
                ))}
            </select>

            {/* Season Filter */}
            <select
                value={selectedSeason || ''}
                onChange={onSeasonChange}
                disabled={!selectedSeries}
                className="px-2 md:px-4 py-2 text-sm md:text-base bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent cursor-pointer transition-all duration-200 hover:bg-gray-750 hover:border-pink-500 disabled:opacity-50 disabled:cursor-not-allowed w-auto"
                style={selectStyles}
            >
                <option value="">All Seasons</option>
                {availableSeasons.map(season => (
                    <option key={season} value={season}>Season {season}</option>
                ))}
            </select>

            {/* Episode Filter */}
            <select
                value={selectedEpisode || ''}
                onChange={onEpisodeChange}
                disabled={!selectedSeason}
                className="px-2 md:px-4 py-2 text-sm md:text-base bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent cursor-pointer transition-all duration-200 hover:bg-gray-750 hover:border-pink-500 disabled:opacity-50 disabled:cursor-not-allowed w-auto"
                style={selectStyles}
            >
                <option value="">All Episodes</option>
                {availableEpisodes.map(episode => (
                    <option key={episode} value={episode}>Episode {episode}</option>
                ))}
            </select>

            {/* Clear Filters Button */}
            {useFilters && (
                <button
                    onClick={onClearFilters}
                    className="px-3 md:px-4 py-2 text-sm md:text-base bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors font-semibold"
                >
                    Clear
                </button>
            )}

            {/* Expand Button */}
            <button
                onClick={onExpandClick}
                className="px-3 md:px-4 py-2 text-sm md:text-base bg-gray-800 text-white border border-gray-700 rounded-lg hover:bg-gray-750 hover:border-pink-500 transition-all duration-200 flex items-center gap-1 md:gap-2"
            >
                <FaExpandAlt size={14} className="md:w-4 md:h-4" />
                <span className="hidden sm:inline">Fullscreen</span>
                <span className="sm:hidden">Full</span>
            </button>
        </div>
    );
}
