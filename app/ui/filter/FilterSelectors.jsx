import { GiPerspectiveDiceSixFacesRandom } from "react-icons/gi";
import { TbArrowsRandom } from "react-icons/tb";
import { IoFilterSharp } from "react-icons/io5";
import { BsChatQuote } from "react-icons/bs";
import { FaFire } from "react-icons/fa6";
import { FaRegClock } from "react-icons/fa";
import { useFilterContext } from '../../context/FilterContext';
import { useRainbowColors } from '../../lib/useRainbowColors';
import { useRouter } from 'next/navigation';
import Link from "next/link";

export const FilterSelectors = () => {

    const { toggleDrawer } = useFilterContext();
    const { getColorForIcon } = useRainbowColors();
    const router = useRouter();

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
                    size={32}
                    onClick={toggleDrawer}
                    style={{ color: getColorForIcon(0) }}
                    className="filter-icon filter-icon-pulse" />
                <Link href="/hot">
                <FaFire
                    title="Hot Backrolls"
                    size={27}
                    onClick={() => pushHotBackroll()}
                    style={{ color: getColorForIcon(1) }}
                    className="filter-icon filter-icon-pulse" />
                    </Link>
                <Link href="/fresh">
                    <FaRegClock
                        title="Fresh Backrolls"
                        size={27}
                        style={{ color: getColorForIcon(2) }}
                        className="filter-icon filter-icon-pulse"
                    /> 
                </Link>
                <GiPerspectiveDiceSixFacesRandom
                    title="Random Backroll"
                    size={32}
                    onClick={() => pushRandomBackroll(1)}
                    style={{ color: getColorForIcon(3) }}
                    className="random-icon" />
                <TbArrowsRandom
                    title="Random Backrolls"
                    size={28}
                    onClick={() => pushRandomBackroll(3)}
                    style={{ color: getColorForIcon(4) }}
                    className="random-icon" />
                <Link href="">
                    <BsChatQuote 
                        title="Have a kiki" 
                        size={28} 
                        style={{ color: getColorForIcon(5) }}
                        className="filter-icon filter-icon-pulse" />
                </Link>
            </div>
        </>
    )
}