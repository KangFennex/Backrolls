'use client'

import PageContainer from '../pageContainer';
import SeriesFilter from './SeriesFilter';
import SeriesList from './components/SeriesList';
import SeriesBreadcrumbs from './components/SeriesBreadcrumbs';

export default function SeriesPageComponent() {

    return (
        <PageContainer>
            <div className="flex flex-col items-center pt-3">
                <SeriesFilter />
                <SeriesBreadcrumbs />
                <div className="w-full flex-col">
                    <SeriesList />
                </div>
            </div>
        </PageContainer>
    );
}