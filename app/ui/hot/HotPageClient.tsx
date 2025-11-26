'use client';

import { BackrollCard } from '..//backrollCards/BackrollCard';
import { useNavigationContext } from '../../context/NavigationContext';
import { useHotQuotes } from '../../lib/hooks';
import PageComponentContainer from '../pageComponentContainer';
import { Quote } from '../../lib/definitions';
import { getMosaicClass } from '../../lib/utils';

export default function HotPageClient() {
    const { navigateToBackroll } = useNavigationContext();
    const { data: hotData } = useHotQuotes(10);
    const useMosaic = hotData?.quotes && hotData.quotes.length >= 8;

    const handleClick = (quote: Quote) => {
        navigateToBackroll(quote);
    }

    return (
        <PageComponentContainer variant={useMosaic ? 'mosaic' : 'list'}>
            {hotData?.quotes && hotData.quotes.map((quote: Quote, index: number) => (
                <div key={quote.id} className={useMosaic ? getMosaicClass(quote.quote_text, index) : ''}>
                    <BackrollCard
                        quote={quote}
                        variant="full"
                        onClick={() => handleClick(quote)}
                        mosaic={useMosaic}
                    />
                </div>
            ))}
        </PageComponentContainer>
    );
}