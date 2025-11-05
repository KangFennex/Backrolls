import SeriesBreadcrumbs from './components/SeriesBreadcrumbs';
import SeriesServer from './components/SeriesServer';

interface SeriesPageServerProps {
    searchParams: Promise<{
        category?: string;
        series?: string;
        season?: string;
        episode?: string;
    }>
}

export default function SeriesPageServer({ searchParams }: SeriesPageServerProps) {
    return (
        <div className="flex items-center pt-3">
            <SeriesBreadcrumbs />
            <div className="w-full flex-col">
                <SeriesServer searchParams={searchParams} />
            </div>
        </div>
    );
}