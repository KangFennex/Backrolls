'use client'

import PageContainer from '../../ui/pageContainer';
import Section from './components/section';
import { useQuotes } from '../../lib/hooks';


export default function Workroom() {
    const { quotes: recentQuotes, loading: recentLoading } = useQuotes('recent');
    const { quotes: topRatedQuotes, loading: topRatedLoading } = useQuotes('top-rated');

    return (
        <main className="flex items-center min-h-screen min-w-full flex-col mt-3">
            <PageContainer className="flex flex-col gap-3">
                <Section
                    title="Fresh backrolls"
                    quotes={recentQuotes}
                    loading={recentLoading}
                />
                <Section
                    title="Top Backrolls"
                    quotes={topRatedQuotes}
                    loading={topRatedLoading}
                />
            </PageContainer>
        </main>
    )
};