import { GiPerspectiveDiceSixFacesRandom } from "react-icons/gi";
import { TbArrowsRandom } from "react-icons/tb";
import { IoFilterSharp } from "react-icons/io5";
import { BsChatQuote } from "react-icons/bs";
import { FaFire } from "react-icons/fa6";
import { FaRegClock } from "react-icons/fa";
import { useNavigationContext } from '../../../context/NavigationContext';
import { useRainbowColors } from '../../../lib/useRainbowColors';
import Link from "next/link";

export const FilterSelectors = () => {

    const { navigateToRandomBackroll } = useNavigationContext();
    const { getColorForIcon } = useRainbowColors();

    const fetchRandomQuote = async (limit = 1) => {
        try {
            const response = await fetch(`/api/random?limit=${limit}`);
            const data = await response.json();

            console.log('Random quote API response:', data); // Debug log

            if (response.ok && data.quote) {
                // Navigate to backrolls page with the random quote
                navigateToRandomBackroll(data.quote);
            } else {
                // Handle API errors or missing quote
                const errorMessage = data.error || 'Failed to fetch random quote';
                console.error('Error fetching random quote:', errorMessage);
                // You could add user feedback here, like a toast notification
            }
        } catch (error) {
            console.error('Error fetching random quote:', error);
        }
    }

    return (
        <div className="flex flex-row items-center gap-2 justify-center">
            <>
                <Link href="/series">
                    <IoFilterSharp
                        title="Filter Backrolls"
                        size={30}
                        style={{ 
                            color: getColorForIcon(0),
                            transition: 'color 1s ease-in-out'
                        }}
                        className="cursor-pointer hover:scale-105 transition-transform duration-200" />
                </Link>
                <Link href="/hot">
                <FaFire
                    title="Hot Backrolls"
                    size={25}
                    style={{ 
                        color: getColorForIcon(1),
                        transition: 'color 1s ease-in-out'
                    }}
                    className="cursor-pointer hover:scale-105 transition-transform duration-200" />
                    </Link>
                <Link href="/fresh">
                    <FaRegClock
                        title="Fresh Backrolls"
                        size={25}
                        style={{ 
                            color: getColorForIcon(2),
                            transition: 'color 1s ease-in-out'
                        }}
                        className="cursor-pointer hover:scale-105 transition-transform duration-200"
                    />
                </Link>
                <GiPerspectiveDiceSixFacesRandom
                    title="Random Backroll"
                    size={30}
                    onClick={() => fetchRandomQuote(1)}
                    style={{ 
                        color: getColorForIcon(3),
                        transition: 'color 1s ease-in-out'
                    }}
                    className="cursor-pointer hover:scale-105 transition-transform duration-200" />
                <TbArrowsRandom
                    title="Random Backrolls"
                    size={26}
                    onClick={() => fetchRandomQuote(5)}
                    style={{ 
                        color: getColorForIcon(4),
                        transition: 'color 1s ease-in-out'
                    }}
                    className="cursor-pointer hover:scale-105 transition-transform duration-200" />
                <Link href="/submit">
                    <BsChatQuote 
                        title="Have a kiki" 
                        size={26} 
                        style={{ 
                            color: getColorForIcon(5),
                            transition: 'color 1s ease-in-out'
                        }}
                        className="cursor-pointer hover:scale-105 transition-transform duration-200" />
                </Link>
            </>
        </div>
    )
}