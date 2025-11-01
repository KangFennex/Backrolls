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
        <div className="top-0 w-full h-14 z-50 px-3">
            <nav className="relative h-full w-full mx-auto md:px-3 flex items-center justify-between">

                <div className="flex-shrink-0 w-10 md:w-12 md:ml-14 md:mt-2">
                    <NavLogo />
                </div>

                <div className="flex-1 ml-0 mr-0 sm:ml-2 sm:mr-2 min-w-0 md:min-w-[350px] md:max-w-[400px] lg:min-w-[500px] lg:max-w-[650px] md:absolute md:left-1/2 md:transform md:-translate-x-1/2">
                    <Search />
                </div>

                <div className="flex-shrink-0">
                    <nav className="flex flex-row gap-2 sm:gap-3 items-center justify center">
                        <Link href="/submit" className="hidden sm:block" aria-label="Submit a quote">
                            <FaPlus size={35} className="text-pink-500 text-2xl sm:text-3xl md:text-4xl" />
                        </Link>
                        <Link href="/coffee" className="hidden sm:block" aria-label="Buy me a coffee">
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
            </nav>
        </div>
    );
};

Nav.displayName = 'Nav';
export default Nav;