'use client';

import { BackrollCardSlim } from '..//backrollCards/BackrollCardSlim';
import { useNavigationContext } from '../../context/NavigationContext';
import { useFreshQuotes } from '../../lib/hooks';
import PageComponentContainer from '../pageComponentContainer';
import type { Quote } from '../../lib/definitions';
import { IndexWrapper } from '../shared/IndexWrapper';

export default function FreshPageClient() {
    const { navigateToBackroll } = useNavigationContext();
    const { data: freshData } = useFreshQuotes();

    const handleClick = (quote: Quote) => {
        navigateToBackroll(quote);
    }

    return (
        <PageComponentContainer title="Fresh Backrolls" subtitle="Fresh out of the oven!">
            {freshData?.quotes && freshData.quotes.map((quote: Quote, index: number) => (
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
