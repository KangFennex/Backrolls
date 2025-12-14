import { useState, useEffect } from 'react';
import { GiPerspectiveDiceSixFacesRandom } from "react-icons/gi";
import { TbArrowsRandom } from "react-icons/tb";
import { IoFilterSharp } from "react-icons/io5";
import { BsChatQuote } from "react-icons/bs";
import { FaFire } from "react-icons/fa6";
import { FaRegClock } from "react-icons/fa";
import { useFiltersContext } from '../../context/FiltersModalContext';
import { useRainbowColors } from '../../lib/hooks';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { PiGameControllerBold } from "react-icons/pi";
import Link from "next/link";

export const FilterSelectorsContent = () => {

    const { isFiltersModalVisible, toggleFilters } = useFiltersContext();
    const { getColorForIcon } = useRainbowColors();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [pathnameState, setPathnameState] = useState<string>(pathname);

    const randomLimit = searchParams.get('limit');

    useEffect(() => {
        setPathnameState(pathname);
    }, [pathname]);

    const pushRandomBackroll = async (limit = 1) => {
        // Navigate to random page with limit parameter
        router.push(`/random?limit=${limit}`);
    }

    const pushHotBackroll = async () => {
        // Navigate to hot page
        router.push(`/hot`);
    }


    return (
        <>
            <div className="flex flex-row items-center gap-2 justify-center py-2">
                <IoFilterSharp
                    title="Filter Backrolls"
                    size={pathnameState === '/series' ? 35 : 30}
                    onClick={() => toggleFilters()}
                    style={{ color: getColorForIcon(0) }}
                    className={`filter-icon filter-icon-pulse transform transition-all duration-700 ease-in-out ${isFiltersModalVisible ? 'rotate-180' : ''
                        }`} />
                {/*  
                <Link href="/hot">
                    <FaFire
                        title="Hot Backrolls"
                        size={pathnameState === '/hot' ? 35 : 27}
                        onClick={() => pushHotBackroll()}
                        style={{ color: getColorForIcon(1) }}
                        className="filter-icon filter-icon-pulse" />
                </Link>
                <Link href="/fresh">
                    <FaRegClock
                        title="Fresh Backrolls"
                        size={pathnameState === '/fresh' ? 35 : 27}
                        style={{ color: getColorForIcon(2) }}
                        className="filter-icon filter-icon-pulse"
                    />
                </Link> */}
                <GiPerspectiveDiceSixFacesRandom
                    title="Random Backroll"
                    size={pathnameState === '/random' && randomLimit === '1' ? 37 : 30}
                    onClick={() => pushRandomBackroll(1)}
                    style={{ color: getColorForIcon(3) }}
                    className="random-icon" />
                <TbArrowsRandom
                    title="Random Backrolls"
                    size={pathnameState === '/random' && randomLimit === '3' ? 35 : 30}
                    onClick={() => pushRandomBackroll(3)}
                    style={{ color: getColorForIcon(4) }}
                    className="random-icon" />
                <Link href="/quiz">
                    <PiGameControllerBold
                        title="Backroll Quiz"
                        size={pathnameState === '/quiz' ? 35 : 26}
                        style={{ color: getColorForIcon(6) }}
                        className="filter-icon filter-icon-pulse" />
                </Link>
                <Link href="">
                    <BsChatQuote
                        title="Have a kiki"
                        size={26}
                        style={{ color: getColorForIcon(5) }}
                        className="filter-icon filter-icon-pulse" />
                </Link>
            </div>
        </>
    )
}