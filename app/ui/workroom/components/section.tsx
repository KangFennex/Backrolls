import { QuoteCard } from '../../backrolls/backrollsCards';
import { Quote } from '../../../lib/definitions';
import { useNavigationContext } from '../../../context/NavigationContext';
import { IoIosArrowForward } from "react-icons/io";

interface SectionProps {
    title?: string;
    quotes?: Quote[];
    loading?: boolean;
}


export default function Section({ title, quotes, loading }: SectionProps) {

    const { navigateToBackroll } = useNavigationContext();

    const handleQuoteClick = (quote: Quote) => {
        navigateToBackroll(quote);
    };

    if (loading) {
        return (
            <section className="w-full h-[200px] my-2 p-2 flex items-center justify-center mb-5">
                <div>Loading quotes...</div>
            </section>
        );
    }

    return (
        <section className="w-full h-[370px] scrollbar-hide overflow-y-scroll">
            <div className="flex items-center pb-2">
                {title && <h2 className="text-lg font-semibold text-pink-500">{title}</h2>}
                <IoIosArrowForward size={15} color="grey" className="ml-1" />
            </div>
            {quotes && quotes.length > 0 ? (
                <div className="flex flex-wrap justify-center overflow-y-auto gap-1 pb-2 scrollbar-hide">
                    {quotes.map((quote, index) => (
                        <div key={quote.id} className="flex-shrink-0 min-w-[250px]">
                            <QuoteCard
                                quote={quote}
                                variant="compact"
                                index={index}
                                onDoubleClick={() => handleQuoteClick(quote)}
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="mt-2 text-center">
                    <p>No quotes available</p>
                </div>
            )}
        </section>
    );
}