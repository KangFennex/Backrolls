'use client';

import { BackrollCard } from '..//backrollCards/BackrollCard';
import { useNavigationContext } from '../../context/NavigationContext';
import { useHotQuotes } from '../../lib/hooks';
import PageComponentContainer from '../pageComponentContainer';
import { Quote } from '../../lib/definitions';

export default function HotPageClient() {
    const { navigateToBackroll } = useNavigationContext();
    const { data: hotData } = useHotQuotes(10);

    const handleClick = (quote: Quote) => {
        navigateToBackroll(quote);
    }

    return (
        <PageComponentContainer>
            {hotData?.quotes && hotData.quotes.map((quote: Quote, index: number) => (
                <div key={quote.id} className="flex-shrink-0 min-w-[250px]">
                    <BackrollCard
                        quote={quote}
                        variant="full"
                        index={index}
                        onClick={() => handleClick(quote)}
                    />
                </div>
            ))}
        </PageComponentContainer>
    );
}