'use client';

import { BackrollCardSlim } from '../backrollCards/BackrollCardSlim';
import { useNavigationContext } from '../../context/NavigationContext';
import { useQuotesByCommentCount } from '../../lib/hooks';
import PageComponentContainer from '../pageComponentContainer';
import type { Quote } from '../../lib/definitions';

export default function PopularPageClient() {
    const { navigateToBackroll } = useNavigationContext();
    const { data: popularData } = useQuotesByCommentCount(20);
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