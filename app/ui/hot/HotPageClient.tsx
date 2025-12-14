'use client';

import { BackrollCardSlim } from '../backrollCards/BackrollCardSlim';
import { useNavigationContext } from '../../context/NavigationContext';
import { useHotQuotes } from '../../lib/hooks';
import PageComponentContainer from '../pageComponentContainer';

export default function HotPageClient() {
    const { navigateToBackroll } = useNavigationContext();
    const { data: hotData } = useHotQuotes(20);

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