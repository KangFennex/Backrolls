'use client';

import { useQuotesByIds } from "../../../lib/hooks";
import '@/app/scss/components/Skeleton.scss';
import BackrollCardSlimSkeleton from '../../backrollCards/BackrollCardSlimSkeleton';
import LoungeQuoteCard from './LoungeQuoteCard';
import '@/app/scss/pages/lounge/LoungeQuoteCard.scss';


interface Comment {
    id: string;
    comment_text: string;
    created_at: string;
    quote_id?: string;
    parent_comment_id?: string | null;
}


export default function CommentedTab({ data, isLoading }: { data: Comment[]; isLoading: boolean }) {

    const quoteIds = data.map(comment => comment.quote_id).filter(Boolean) as string[];
    const { data: quotes } = useQuotesByIds(quoteIds);
    const quotesMap = new Map(quotes?.map(quote => [quote.id, quote]) || [])


    if (data && data.length > 0) {
        console.log('First comment text:', data[0].comment_text);
    }

    if (isLoading) {
        return (
            <div className="w-full">
                <div className="grid gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <BackrollCardSlimSkeleton key={i} />
                    ))}
                </div>
            </div>
        );
    }
    if (!data || data.length === 0) {
        return <div className="text-center py-12 rounded-lg" style={{ color: 'rgba(255, 255, 240, 0.5)' }}>No commented quotes found.</div>;
    }

    return (
        <div className="w-full">
            <ul className="grid gap-2">
                {data.map((comment: Comment) => {
                    const quote = comment.quote_id ? quotesMap.get(comment.quote_id) : null;

                    if (!quote) return null;

                    return (
                        <li key={comment.id}>
                            <LoungeQuoteCard
                                quote={quote}
                                variant="commented"
                                commentText={comment.comment_text}
                            />
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}