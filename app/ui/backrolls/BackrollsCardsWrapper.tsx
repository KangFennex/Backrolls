import "./backrolls.scss";
import { useBackrollsStore } from '../../store/backrollsStore';
import { BackrollCard } from "./BackrollCard";

export default function BackrollsCardsWrapper() {
    const displayResults = useBackrollsStore((state) => state.displayResults);

    return (
        <div className="w-full">
            {displayResults.length > 0 ? (
                displayResults.map((quote, index) => (
                    <BackrollCard
                        variant="full"
                        key={quote.id}
                        quote={quote}
                        index={index}
                    />
                ))
            ) : (
                <div className="flex items-center justify-center">
                    <h3>No quotes...</h3>
                </div>
            )}
        </div>
    );
}