'use client';

import { Quote } from "../../../lib/definitions";
import '@/app/scss/components/Skeleton.scss';
import BackrollCardSlimSkeleton from '../../backrollCards/BackrollCardSlimSkeleton';
import LoungeQuoteCard from './LoungeQuoteCard';
import '@/app/scss/pages/lounge/LoungeQuoteCard.scss';

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
        return <div className="text-center py-12 rounded-lg" style={{ color: 'rgba(255, 255, 240, 0.5)' }}>No favorites found. Start favoriting quotes!</div>;
    }
    return (
        <div className="w-full">
            <div className="grid gap-2">
                {data.map((quote: Quote) => (
                    <LoungeQuoteCard
                        key={quote.id}
                        quote={quote}
                        variant="favorites"
                    />
                ))}
            </div>
        </div>
    );
}