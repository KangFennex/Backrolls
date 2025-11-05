import { Quote } from '../../../lib/definitions';
import { useNavigationContext } from '../../../context/NavigationContext';
import { IoIosArrowForward } from "react-icons/io";
import { BackrollCard } from '../../backrolls/BackrollCard';

interface SectionProps {
    title?: string;
    quotes?: Quote[];
    loading?: boolean;
}


export default function Section({ quotes, }: SectionProps) {

    const { navigateToBackroll } = useNavigationContext();

    const handleQuoteClick = (quote: Quote) => {
        navigateToBackroll(quote);
    };

    return (
        <section className="flex flex-col w-full h-auto scrollbar-hide overflow-y-scroll">
            {/*
            <div className="flex items-center pb-2">
                {title && <h2 className="text-lg font-semibold text-pink-500">{title}</h2>}
                <IoIosArrowForward size={15} color="grey" className="ml-1" />
            </div>
            */}
            {quotes && quotes.length > 0 ? (
                <div className="flex flex-col w-full gap-2 overflow-y-auto scrollbar-hide">
                    {quotes.map((quote, index) => (
                        <div key={quote.id} className="w-full">
                            <BackrollCard
                                quote={quote}
                                variant="full"
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