'use client'

import { BackrollCard } from '..//backrollCards/BackrollCard';
import { useNavigationContext } from '../../context/NavigationContext';
import PageComponentContainer from '../pageComponentContainer';
import { Quote } from '../../lib/definitions';
import { useBackrollsStore } from '../../store/backrollsStore';

export default function BackrollsPageClient() {
    const { navigateToBackroll } = useNavigationContext();
    const displayResults = useBackrollsStore((state) => state.displayResults);

    const handleClick = (quote: Quote) => {
        navigateToBackroll(quote);
    }

    return (
        <PageComponentContainer>
            {displayResults.map((quote, index) => (
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