import { useState, useEffect, useCallback } from 'react';
import { Quote } from '../definitions';
import { NextResponse } from 'next/server';

export function useQuotes(type: string, enabled = true) {
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchQuotes = useCallback(async () => {
        if (!enabled) return;

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/display?type=${type}&limit=10`);
            const data = await response.json();

            if (data.success) {
                setQuotes(data.quotes || []);
            } else {
                setError(data.error || 'Failed to fetch quotes');
            }
        } catch (error) {
            setError('Failed to fetch quotes');
            return NextResponse.json({
                error: 'Failed to fetch quotes.',
                details: error instanceof Error ? error.message : 'Unknown error'
            }, { status: 500 });
        } finally {
            setLoading(false);
        }
    }, [enabled, type]);

    // Listen for vote updates
    useEffect(() => {
        const handleVoteUpdate = (event: Event) => {
            const customEvent = event as CustomEvent;
            const { quoteId, newVoteCount } = customEvent.detail;

            setQuotes(currentQuotes =>
                currentQuotes.map(quote =>
                    quote.id === quoteId
                        ? { ...quote, vote_count: newVoteCount }
                        : quote
                )
            )
        }

        window.addEventListener('voteUpdated', handleVoteUpdate);

        return () => {
            window.removeEventListener('voteUpdated', handleVoteUpdate);
        };
    }, []);

    useEffect(() => {
        fetchQuotes();
    }, [fetchQuotes]);

    return {
        quotes,
        loading,
        error,
        refresh: fetchQuotes
    };
}