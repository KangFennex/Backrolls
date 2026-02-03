import { Quote } from '../../../lib/definitions';
import '@/app/scss/pages/WorkroomVerticalColumns.scss';
import { BackrollCardSlim } from '../../backrollCards/BackrollCardSlim';
import { BackrollsLogoSmall } from '../../shared/BackrollsLogo';
import { useNavigationContext } from '../../../context/NavigationContext';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ColumnProps {
    title: string;
    data: Quote[];
    isLoading: boolean;
    link?: string;
    initialLimit: number;
}

export default function WorkroomVerticalColumn({ title, data, isLoading, link, initialLimit }: ColumnProps) {
    const { navigateToBackroll } = useNavigationContext();
    const [displayLimit, setDisplayLimit] = useState(initialLimit);
    const [hasExpanded, setHasExpanded] = useState(false);
    const router = useRouter();

    const handleClick = (quote: Quote) => {
        navigateToBackroll(quote);
    };

    const handleShowMore = () => {
        if (!hasExpanded) {
            // First click: Load 10 more quotes
            setDisplayLimit(prev => prev + 10);
            setHasExpanded(true);
        } else {
            // Second click: Redirect to the column's link
            if (link) {
                router.push(link);
            }
        }
    };

    const displayedData = data.slice(0, displayLimit);

    return (

        <div className="vertical-column">
            {link ? (
                <div className="flex items-center gap-2">
                    <BackrollsLogoSmall />
                    <Link href={link} className="tektur flex items-center mr-auto pl-2 hover:text-pink-500 transition-all duration-300 ease-in-out md:pl-0">
                        <h3 className="flex items-center vertical-column-title hover:text-pink-500 transition-all duration-300 ease-in-out">{title}</h3>
                    </Link>
                </div>
            ) : (
                <div className="flex items-center gap-2">
                    <BackrollsLogoSmall />
                    <h3 className="tektur vertical-column-title mr-auto hover:text-pink-500 transition-all duration-300 ease-in-out pl-2 md:pl-0">{title}</h3>
                </div>
            )

            }

            <div className="vertical-column-content">

                {isLoading && (
                    <p className="text-center text-gray-400 py-8">Loading...</p>
                )}

                {!isLoading && data.length === 0 && (
                    <p className="text-center text-gray-400 py-8">No data available.</p>
                )}

                {!isLoading && data.length > 0 && displayedData.map((quote: Quote) => (
                    <div key={quote.id}>
                        <BackrollCardSlim
                            quote={quote}
                            onClick={() => handleClick(quote)}
                        />
                    </div>
                ))}

                {/* Show More Button */}
                {!isLoading && data.length > 0 && (
                    <div className="show-more-divider">
                        <button
                            onClick={handleShowMore}
                            className="show-more-btn"
                        >
                            {hasExpanded ? 'See All' : 'Show More'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};