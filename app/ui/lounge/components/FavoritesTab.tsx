'use client';

import { Quote } from "../../../lib/definitions";
import '../../shared/Skeleton.scss';
import BackrollCardSlimSkeleton from '../../backrollCards/BackrollCardSlimSkeleton';

export default function FavoritesTab({ data, isLoading }: { data: Quote[]; isLoading: boolean }) {
    if (isLoading) {
        return (
            <div className="w-full">
                <div className="grid gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <BackrollCardSlimSkeleton key={i} />
                    ))}
                </div>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return <div className="text-center text-gray-500 py-12 bg-gray-50 rounded-lg">No favorites found. Start favoriting quotes!</div>;
    }
    return (
        <div className="w-full">
            <h2 className="text-2xl font-bold mb-6 text-pink-600">Favorited Backrolls</h2>
            <div className="grid gap-4">
                {data.map((quote: Quote) => (
                    <div key={quote.id} className="p-5 bg-white border-2 border-pink-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <p className="text-lg italic text-gray-800 mb-2">&ldquo;{quote.quote_text}&rdquo;</p>
                        <p className="text-sm text-gray-600">— {quote.speaker}</p>
                        <div className="mt-3 flex gap-2 text-xs text-gray-500">
                            <span>{quote.series}</span>
                            <span>•</span>
                            <span>S{quote.season}E{quote.episode}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}