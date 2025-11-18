'use client';

import { Quote } from "../../../lib/definitions";

export default function CommentedTab({ data, isLoading }: { data: Quote[]; isLoading: boolean }) {
    if (isLoading) {
        return <div>Loading commented quotes...</div>;
    }
    if (!data || data.length === 0) {
        return <div>No commented quotes found.</div>;
    }

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Commented Quotes</h2>
            <ul>
                {data.map((quote: Quote) => (
                    <li key={quote.id} className="mb-4 p-4 border rounded">
                        <p className="text-lg italic">{quote.quote_text}</p>
                        <p className="text-sm text-gray-600">- {quote.speaker}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}