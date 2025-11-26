'use client'

import { Quote } from '../../lib/definitions';
import { useWorkroomQuotes } from '../../lib/hooks';
import { BackrollCard } from '../backrollCards/BackrollCard';
import { useNavigationContext } from '../../context/NavigationContext';
import PageComponentContainer from '../pageComponentContainer';
import { getMosaicClass } from '../../lib/utils';

export default function WorkroomPageClient() {
    const { navigateToBackroll } = useNavigationContext();
    const { data: workroomQuotes, isLoading } = useWorkroomQuotes(30);
    const useMosaic = workroomQuotes ? workroomQuotes.length > 8 : false;

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

    if (!workroomQuotes || workroomQuotes.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                No backrolls for you today
            </div>
        );
    }

    return (
        <PageComponentContainer variant={useMosaic ? 'mosaic' : 'list'}>
            {workroomQuotes.map((quote: Quote, index: number) => (
                <div
                    key={quote.id}
                    className={useMosaic ? getMosaicClass(quote.quote_text, index) : ''}
                >
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
