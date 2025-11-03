import { BackrollCard } from '../backrolls/BackrollCard';
import { Quote } from '../../lib/definitions';
import { useQuotes } from '../../lib/hooks';
import { useNavigationContext } from '../../context/NavigationContext';

export default function HotBackrolls() {
    const { quotes: hotQuotes, loading: hotLoading } = useQuotes('top-rated');
    const { navigateToBackroll } = useNavigationContext();

    const handleQuoteClick = (quote: Quote) => {
        navigateToBackroll(quote);
    };

    if (hotLoading) {
        return (
            <section className="w-full h-[200px] my-2 p-2 flex items-center justify-center mb-5">
                <div>Loading hot quotes...</div>
            </section>
        );
    }

    return (
        <main className="flex wrap w-full h-full flex-wrap mt-3 p-3 gap-2 justify-center">
            {hotQuotes.map((quote, index) => (
                <BackrollCard
                    key={quote.id}
                    quote={quote}
                    variant="full"
                    onDoubleClick={() => handleQuoteClick(quote)}
                    index={index}
                />
            ))}
        </main>
    );
};