'use client'

import { Quote } from '../../lib/definitions';
import { useWorkroomQuotes } from '../../lib/hooks';
import { BackrollCard } from '../backrollCards/BackrollCard';
import { useNavigationContext } from '../../context/NavigationContext';
import PageComponentContainer from '../pageComponentContainer';
import { usePathname } from 'next/navigation';
import { getMosaicClass } from '../../lib/utils';

export default function WorkroomPageClient() {
    const { navigateToBackroll } = useNavigationContext();
    const { data: quotes, isLoading } = useWorkroomQuotes(30);
    const pathname = usePathname();

    const isMainPage = pathname === '/';

    const handleClick = (quote: Quote) => {
        navigateToBackroll(quote);
    }

    if (isLoading) {
        return (
            <div className="text-center py-8 text-gray-500">
                Loading...
            </div>
        );
    }

    if (!quotes || quotes.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                No backrolls for you today
            </div>
        );
    }

    return (
        <PageComponentContainer variant={isMainPage ? 'mosaic' : 'list'}>
            {quotes.map((quote: Quote, index: number) => (
                <div
                    key={quote.id}
                    className={isMainPage ? getMosaicClass(quote.quote_text, index) : ''}
                >
                    <BackrollCard
                        quote={quote}
                        variant="full"
                        index={index}
                        onClick={() => handleClick(quote)}
                        isMainPage={isMainPage}
                    />
                </div>
            ))}
        </PageComponentContainer>
    );
}
