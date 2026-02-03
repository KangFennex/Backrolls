'use client'

import { useFreshQuotesLimited, useHotQuotesLimited, useQuotesByCommentCountLimited } from '../../../lib/hooks';
import '@/app/scss/pages/WorkroomVerticalColumns.scss';
import WorkroomVerticalColumnsSkeleton from './WorkroomVerticalColumnsSkeleton';
import Column from './WorkroomVerticalColumn';

export default function WorkroomVerticalColumns() {
    const { data: commentCountData, isLoading: isCommentCountLoading } = useQuotesByCommentCountLimited(20);
    const { data: freshData, isLoading: isFreshLoading } = useFreshQuotesLimited(20);
    const { data: hotData, isLoading: isHotLoading } = useHotQuotesLimited(20);

    const isAnyLoading = isFreshLoading || isCommentCountLoading || isHotLoading;

    return (
        <section className="workroom-vertical-columns">
            {isAnyLoading ? (
                <WorkroomVerticalColumnsSkeleton />
            ) : (
                <div className="vertical-columns-container">
                    <Column
                        title="Fresh Backrolls"
                        data={freshData?.quotes || []}
                        isLoading={false}
                        link="/fresh"
                        initialLimit={10}
                    />
                    <Column
                        title="Popular Backrolls"
                        data={commentCountData?.quotes || []}
                        isLoading={false}
                        link="/popular"
                        initialLimit={10}
                    />
                    <Column
                        title="Hot Backrolls"
                        data={hotData?.quotes || []}
                        isLoading={false}
                        link="/hot"
                        initialLimit={10}
                    />
                </div>
            )}
        </section>
    );
}
