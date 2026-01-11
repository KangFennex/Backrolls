'use client';

import { useQuotesByIds } from "../../../lib/hooks";
import '@/app/scss/components/Skeleton.scss';
import BackrollCardSlimSkeleton from '../../backrollCards/BackrollCardSlimSkeleton';


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
        return <div>No commented quotes found.</div>;
    }

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6 text-purple-600">Comments</h2>
            <ul className="grid gap-4">
                {data.map((comment: Comment) => {
                    const quote = comment.quote_id ? quotesMap.get(comment.quote_id) : null;

                    return (
                        <li key={comment.id} className="p-5 bg-white border-2 border-purple-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-2">
                                <p className="text-lg italic text-gray-800 flex-1">
                                    &ldquo;{quote ? quote.quote_text : 'Quote not available'}&rdquo;
                                </p>
                            </div>
                            <span className="text-sm text-gray-600">— {quote ? quote.speaker : 'Unknown speaker'}</span>
                            <p className="text-lg italic">{comment.comment_text}</p>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}