'use client';

import { BackrollCardSlim } from '../backrollCards/BackrollCardSlim';
import { useNavigationContext } from '../../context/NavigationContext';
import { useHotQuotes } from '../../lib/hooks';
import PageComponentContainer from '../pageComponentContainer';
import type { Quote } from '../../lib/definitions';
import { IndexWrapper } from '../shared/IndexWrapper';

export default function HotPageClient() {
    const { navigateToBackroll } = useNavigationContext();
    const { data: hotData } = useHotQuotes(20);

    const handleClick = (quote: Quote) => {
        navigateToBackroll(quote);
    }

    return (
        <PageComponentContainer title="Hot Backrolls" subtitle="Those backrolls are backrolling!">
            {hotData?.quotes && hotData.quotes.map((quote: Quote, index: number) => (
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