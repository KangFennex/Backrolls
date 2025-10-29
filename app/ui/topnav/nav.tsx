'use client';

import Logo from './logo/logo';
import Search from '../search/Search';
import { BsCupHot, BsCupHotFill } from "react-icons/bs";
import { RiSofaLine, RiSofaFill } from "react-icons/ri";
import { FaPlus } from 'react-icons/fa';
import Link from 'next/link';
import { useAuth } from "../../lib/hooks";

function Nav() {
    const { isAuthenticated } = useAuth();

    return (
        <div
            className="top-0 w-full h-14 z-50 px-3"
        >
            <nav className="relative h-full w-full mx-auto px-3 flex items-center justify-between">

                <div className="flex-shrink-0 w-10 md:w-12 md:ml-14 md:mt-2">
                    <Logo />
                </div>

                <div className="flex-1 ml-2 min-w-0 max-w-[300px] md:min-w-[350px] md:max-w-[500px] lg:min-w-[600px] lg:max-w-[750px] md:absolute md:left-1/2 md:transform md:-translate-x-1/2">
                    <Search />
                </div>

                <div className="flex-shrink-0 mt-2">
                    <nav className="flex flex-row gap-3 items-center justify center">
                        <Link href="/submit" aria-label="Submit a quote">
                            <FaPlus size={45} className="text-pink-500 text-3xl md:text-4xl mb-1" />
                        </Link>
                        <Link href="/coffee" aria-label="Buy me a coffee">
                            {isAuthenticated ?
                                <BsCupHotFill size={40} className="text-pink-500 text-4xl mb-1" /> :
                                <BsCupHot size={40} className="text-pink-500 text-4xl mb-1" />}
                        </Link>
                        <Link href="/lounge" aria-label="Access the lounge">
                            {isAuthenticated ?
                                <RiSofaFill className="text-pink-500 text-5xl mb-1" /> :
                                <RiSofaLine className="text-pink-500 text-5xl mb-1" />}
                        </Link>
                    </nav>
                </div>
            </nav>
        </div>
    );
};

Nav.displayName = 'Nav';
export default Nav;