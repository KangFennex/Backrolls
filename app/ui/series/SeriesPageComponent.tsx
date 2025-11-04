'use client'

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import SeriesList from './components/SeriesList';
import SeriesBreadcrumbs from './components/SeriesBreadcrumbs';
import { useSeriesContext } from '../../context/SeriesContext';

export default function SeriesPageComponent() {
    const searchParams = useSearchParams();
    const {
        setSeriesCategory,
        setSelectedSeries,
        setSelectedSeason,
        setSelectedEpisode
    } = useSeriesContext();

    // Apply URL parameters to SeriesContext on mount
    useEffect(() => {
        const category = searchParams.get('category');
        const series = searchParams.get('series');
        const season = searchParams.get('season');
        const episode = searchParams.get('episode');

        if (category) {
            setSeriesCategory(category);
        }

        if (series) {
            setSelectedSeries(series);
        }

        if (season) {
            setSelectedSeason(parseInt(season, 10));
        }

        if (episode) {
            setSelectedEpisode(parseInt(episode, 10));
        }
    }, [searchParams, setSeriesCategory, setSelectedSeries, setSelectedSeason, setSelectedEpisode]);

    return (
        <div className="flex flex-col items-center pt-3">
            <SeriesBreadcrumbs />
            <div className="w-full flex-col">
                <SeriesList />
            </div>
        </div>
    );
}