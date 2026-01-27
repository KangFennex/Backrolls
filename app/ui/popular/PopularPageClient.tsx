'use client';

import { BackrollCardSlim } from '../backrollCards/BackrollCardSlim';
import { useNavigationContext } from '../../context/NavigationContext';
import { useQuotesByCommentCount } from '../../lib/hooks';
import PageComponentContainer from '../pageComponentContainer';
import type { Quote } from '../../lib/definitions';
import { IndexWrapper } from '../shared/IndexWrapper';

export default function PopularPageClient() {
    const { navigateToBackroll } = useNavigationContext();
    const { data: popularData } = useQuotesByCommentCount(20);
    const handleClick = (quote: Quote) => {
        navigateToBackroll(quote);
    }

    return (
        <PageComponentContainer title="Popular Backrolls" subtitle="Talk of the Town!">
            {popularData?.quotes && popularData.quotes.map((quote: Quote, index: number) => (
                <div key={quote.id}>
                    <IndexWrapper index={index}>
                        <BackrollCardSlim
                            quote={quote}
                            onClick={() => handleClick(quote)}
                        />
                    </IndexWrapper>
                </div>
            ))}
        </PageComponentContainer>
    );
}