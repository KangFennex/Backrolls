import SeriesBreadcrumbs from './components/SeriesBreadcrumbs';
import SeriesServer from './components/SeriesServer';
import { SeriesPageServerProps } from '../../lib/definitions';

export default function SeriesPageServer({ searchParams }: SeriesPageServerProps) {
    return (
        <div className="w-full">
            <SeriesBreadcrumbs />
            <div className="w-full">
                <SeriesServer searchParams={searchParams} />
            </div>
        </div>
    );
}