import { useSeriesContext } from "../../../context/SeriesContext";

export default function SeriesBreadcrumbs() {
    const {
        seriesCategory,
        selectedSeries,
        selectedSeason,
        selectedEpisode,
    } = useSeriesContext();

    const adjustedCategory = (category: string | null) => {
        if (category === 'main-series') {
            return "RuPaul's Drag Race";
        } else if (category === 'all-stars') {
            return "All-Stars";
        } else if (category === 'spin-off') {
            return "Spin-Off";
        } else if (category === 'international') {
            return "International";
        }
        return category;
    };

    return (
        <>
            {(seriesCategory || selectedSeries || selectedSeason || selectedEpisode) && (
                <div className="w-full text-[#FFFFF0] text-left text-sm mb-2 mt-2">
                    {seriesCategory && <span>{adjustedCategory(seriesCategory)} <span> • </span></span>}
                    {selectedSeries && <span>{selectedSeries} <span> • </span></span>}
                    {selectedSeason && <span>S{selectedSeason > 9 ? selectedSeason : `0${selectedSeason}`}</span>}
                    {selectedEpisode && <span>E{selectedEpisode > 9 ? selectedEpisode : `0${selectedEpisode}`}</span>}
                </div>
            )}
        </>
    );
}