import "./backrolls.scss";
import { useBackrollsStore } from '../../store/backrollsStore';
import { QuoteCard } from './QuoteCard';

export default function BackrollsCardsWrapper() {
    const displayResults = useBackrollsStore((state) => state.displayResults);

    return (
        <div className="backrolls-cards w-full h-full pt-4">
            {displayResults.length > 0 ? (
                displayResults.map((quote, index) => (
                    <QuoteCard
                        variant="compact"
                        key={quote.id}
                        quote={quote}
                        index={index}
                    />
                ))
            ) :
                <div>
                    <h3>No quotes...</h3>
                </div>
            }
        </div>
    );
}