'use client';

import { NavLogo } from '../sharedComponents';
import Search from '../search/Search';
import { BsCupHot, BsCupHotFill } from "react-icons/bs";
import { RiSofaLine, RiSofaFill } from "react-icons/ri";
import { FaPlus } from 'react-icons/fa';
import Link from 'next/link';
import { useAuth } from "../../lib/hooks";

function Nav() {
    const { isAuthenticated } = useAuth();

    return (
        <div className="top-0 w-full z-50 px-3">
            {/* Main nav container - responsive height */}
            <nav className="relative w-full mx-auto md:px-3">
                
                {/* Top row - logo and icons */}
                <div className="h-14 flex items-center justify-between">
                    <div className="flex-shrink-0 w-10 md:w-12 md:ml-14 md:mt-2">
                        <NavLogo />
                    </div>

                    {/* Search bar for md+ screens */}
                    <div className="hidden md:flex flex-1 ml-0 mr-0 min-w-[350px] max-w-[400px] lg:min-w-[500px] lg:max-w-[650px] absolute left-1/2 transform -translate-x-1/2">
                        <Search />
                    </div>

                    <div className="flex-shrink-0">
                        <nav className="flex flex-row gap-2 sm:gap-3 items-center justify-center">
                            <Link href="/submit" aria-label="Submit a quote">
                                <FaPlus size={35} className="text-pink-500 text-2xl sm:text-3xl md:text-4xl" />
                            </Link>
                            <Link href="/coffee" aria-label="Buy me a coffee">
                                {isAuthenticated ?
                                    <BsCupHotFill size={30} className="text-pink-500 text-3xl sm:text-4xl mb-1" /> :
                                    <BsCupHot size={30} className="text-pink-500 text-3xl sm:text-4xl mb-1" />}
                            </Link>
                            <Link href="/lounge" className="mx-2 sm:mx-0" aria-label="Access the lounge">
                                {isAuthenticated ?
                                    <RiSofaFill size={35} className="text-pink-500 text-4xl sm:text-5xl mb-1" /> :
                                    <RiSofaLine size={35} className="text-pink-500 text-4xl sm:text-5xl mb-1" />}
                            </Link>
                        </nav>
                    </div>
                </div>

                {/* Search bar for mobile/tablet screens - below the main row */}
                <div className="md:hidden pb-3 px-2">
                    <Search />
                </div>
            </nav>
        </div>
    );
};

Nav.displayName = 'Nav';
export default Nav;