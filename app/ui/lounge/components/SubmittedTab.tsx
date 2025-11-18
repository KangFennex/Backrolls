'use client';

import { Quote } from "../../../lib/definitions";

export default function SubmittedTab({ data, isLoading }: { data: Quote[]; isLoading: boolean }) {
    if (isLoading) {
        return <div className="text-center text-gray-600 py-8">Loading submitted quotes...</div>;
    }
    if (!data || data.length === 0) {
        return <div className="text-center text-gray-500 py-12 bg-gray-50 rounded-lg">No submitted quotes found. Submit your first quote!</div>;
    }

    return (
        <div className="w-full">
            <h2 className="text-2xl font-bold mb-6 text-purple-600">Submitted Quotes</h2>
            <div className="grid gap-4">
                {data.map((quote: Quote) => (
                    <div key={quote.id} className="p-5 bg-white border-2 border-purple-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                            <p className="text-lg italic text-gray-800 flex-1">&ldquo;{quote.quote_text}&rdquo;</p>
                            <span className={`ml-4 px-3 py-1 text-xs rounded-full ${
                                quote.is_approved 
                                    ? 'bg-green-100 text-green-700' 
                                    : 'bg-yellow-100 text-yellow-700'
                            }`}>
                                {quote.is_approved ? 'Approved' : 'Pending'}
                            </span>
                        </div>
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