import { Quote } from '../../lib/definitions';
import { useQuotes } from '../../lib/hooks';
import { useNavigationContext } from '../../context/NavigationContext';
import { BackrollCard } from '../backrollCards/BackrollCard';

export default function FreshBackrolls() {
    const { quotes: freshQuotes, loading: freshLoading } = useQuotes('recent');
    const { navigateToBackroll } = useNavigationContext();

    const handleClick = (quote: Quote) => {
        navigateToBackroll(quote);
    };

    if (freshLoading) {
        return (
            <section className="w-full h-[200px] my-2 p-2 flex items-center justify-center mb-5">
                <div>Loading fresh quotes...</div>
            </section>
        );
    }

    return (
        <main className="flex wrap w-full h-full flex-wrap mt-3 p-3 gap-2 justify-center">
            {freshQuotes.map((quote, index) => (
                <BackrollCard
                    key={quote.id}
                    quote={quote}
                    variant="full"
                    onClick={() => handleClick(quote)}
                    index={index}
                />
            ))}
        </main>
    );
};