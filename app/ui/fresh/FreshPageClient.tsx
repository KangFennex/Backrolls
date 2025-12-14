'use client';

import { BackrollCardSlim } from '..//backrollCards/BackrollCardSlim';
import { useNavigationContext } from '../../context/NavigationContext';
import { useFreshQuotes } from '../../lib/hooks';
import PageComponentContainer from '../pageComponentContainer';
import type { Quote } from '../../lib/definitions';

export default function FreshPageClient() {
    const { navigateToBackroll } = useNavigationContext();
    const { data: freshData } = useFreshQuotes();

    const handleClick = (quote: Quote) => {
        navigateToBackroll(quote);
    }

    const IndexWrapper = ({ children, index }: { children: React.ReactNode, index: number }) => {
        return (
            <div className="flex items-center gap-2">
                <h4 className="antique-parchment-text-dark rotate-270 text-[30px] p-2.5">{index + 1}</h4>
                {children}
            </div>
        );
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
