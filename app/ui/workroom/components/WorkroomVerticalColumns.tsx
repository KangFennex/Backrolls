'use client'

import { Quote } from '../../../lib/definitions';
import { useNavigationContext } from '../../../context/NavigationContext';
import { useFreshQuotes, useHotQuotes, useQuotesByCommentCount } from '../../../lib/hooks';
import { BackrollCardSlim } from '../../backrollCards/BackrollCardSlim';
import Link from 'next/link';
import './WorkroomVerticalColumns.scss';
import WorkroomVerticalColumnsSkeleton from './WorkroomVerticalColumnsSkeleton';

interface ColumnProps {
    title: string;
    data: Quote[];
    isLoading: boolean;
    link?: string;
}

function Column({ title, data, isLoading, link }: ColumnProps) {
    const { navigateToBackroll } = useNavigationContext();

    const handleClick = (quote: Quote) => {
        navigateToBackroll(quote);
    };

    return (
        <div className="vertical-column">
            {link ? (
                <Link href={link} className="mr-auto pl-2 hover:text-pink-500 transition-all duration-300 ease-in-out md:pl-0">
                    <h3 className="vertical-column-title hover:text-pink-500 transition-all duration-300 ease-in-out">{title}</h3>
                </Link>
            ) : (
                <h3 className="vertical-column-title mr-auto hover:text-pink-500 transition-all duration-300 ease-in-out pl-2 md:pl-0">{title}</h3>
            )}

            <div className="vertical-column-content">

                {isLoading && (
                    <p className="text-center text-gray-400 py-8">Loading...</p>
                )}

                {!isLoading && data.length === 0 && (
                    <p className="text-center text-gray-400 py-8">No data available.</p>
                )}

                {!isLoading && data.length > 0 && data.map((quote: Quote) => (
                    <div key={quote.id}>
                        <BackrollCardSlim
                            quote={quote}
                            onClick={() => handleClick(quote)}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function WorkroomVerticalColumns() {
    const { data: commentCountData, isLoading: isCommentCountLoading } = useQuotesByCommentCount(10);
    const { data: freshData, isLoading: isFreshLoading } = useFreshQuotes(10);
    const { data: hotData, isLoading: isHotLoading } = useHotQuotes(10);

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
                    />
                    <Column
                        title="Talk of the Town"
                        data={commentCountData?.quotes || []}
                        isLoading={false}
                        link="/kiki"
                    />
                    <Column
                        title="Hot Backrolls"
                        data={hotData?.quotes || []}
                        isLoading={false}
                        link="/hot"
                    />
                </div>
            )}
        </section>
    );
}
