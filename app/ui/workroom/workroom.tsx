'use client'

import PageContainer from '../../ui/pageContainer';
import Lead from './components/lead';
import Section from './components/section';
import { Quote } from '../../lib/definitions';
import { useQuotes } from '../../lib/hooks';


export default function Workroom() {
    const { quotes: recentQuotes, loading: recentLoading } = useQuotes('recent');
    const { quotes: topRatedQuotes, loading: topRatedLoading } = useQuotes('top-rated');

    return (
        <main className="flex items-center min-h-screen min-w-full flex-col mt-3">
            <PageContainer className="flex flex-col gap-3">
                {/* <Lead /> */}
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