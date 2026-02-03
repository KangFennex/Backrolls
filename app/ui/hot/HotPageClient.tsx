'use client';

import { BackrollCardSlim } from '../backrollCards/BackrollCardSlim';
import BackrollCardSlimSkeleton from '../backrollCards/BackrollCardSlimSkeleton';
import { useEffect, useRef } from 'react';
import { useNavigationContext } from '../../context/NavigationContext';
import { useHotQuotes } from '../../lib/hooks';
import PageComponentContainer from '../pageComponentContainer';
import type { Quote } from '../../lib/definitions';
import { IndexWrapper } from '../shared/IndexWrapper';

export default function HotPageClient() {
    const { navigateToBackroll } = useNavigationContext();
    const { allQuotes: hotData, fetchNextPage, hasNextPage, isFetchingNextPage } = useHotQuotes({ limit: 20 });

    const observerTarget = useRef<HTMLDivElement>(null);

    const handleClick = (quote: Quote) => {
        navigateToBackroll(quote);
    }

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                    fetchNextPage();
                }
            },
            {
                threshold: 0.1,
            }
        );

        const currentTarget = observerTarget.current;
        if (currentTarget) {
            observer.observe(currentTarget);
        }

        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget);
            }
        };
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    return (
        <PageComponentContainer title="Hot Backrolls">
            {hotData.map((quote: Quote, index: number) => (
                <div key={quote.id}>
                    <IndexWrapper index={index}>
                        <BackrollCardSlim
                            quote={quote}
                            onClick={() => handleClick(quote)}
                        />
                    </IndexWrapper>
                </div>
            ))}
            <div ref={observerTarget} style={{ marginTop: '20px' }}>
                {isFetchingNextPage && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {Array.from({ length: 3 }).map((_, i) => (
                            <BackrollCardSlimSkeleton key={i} />
                        ))}
                    </div>
                )}
            </div>
        </PageComponentContainer>
    );
}