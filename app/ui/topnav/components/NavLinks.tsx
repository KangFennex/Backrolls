'use client';

import Link from 'next/link';
import { BsCupHotFill } from "react-icons/bs";
import { GiPerspectiveDiceSixFacesRandom } from "react-icons/gi";
import { FaFire } from "react-icons/fa6";
import { FaRegCommentDots } from "react-icons/fa";
import { PiGameControllerBold } from "react-icons/pi";
import { FaRegQuestionCircle } from "react-icons/fa";
import { useRainbowColors } from '../../../lib/hooks/useRainbowColors';

export type NavItem = {
    title: string;
    href: string;
    icon: React.ReactNode;
};

export const navItems: NavItem[] = [
    { title: 'Hot Backrolls', href: '/hot', icon: <FaFire /> },
    { title: 'Popular Backrolls', href: '/popular', icon: <FaRegCommentDots /> },
    { title: 'Random Backrolls', href: '/random', icon: <GiPerspectiveDiceSixFacesRandom /> },
    { title: 'Guess', href: '/guess', icon: <FaRegQuestionCircle /> },
    { title: 'Quiz', href: '/quiz', icon: <PiGameControllerBold /> },
    { title: 'Tea Room', href: '/tea-room', icon: <BsCupHotFill /> },
];

interface NavLinksProps {
    hoveredIconIndex: number | null;
    onIconMouseEnter: (index: number) => void;
    onIconMouseLeave: () => void;
    getColorForIcon: (index: number) => string;
}

export function NavLinks({
    hoveredIconIndex,
    onIconMouseEnter,
    onIconMouseLeave,
}: NavLinksProps) {
    const { getColorForIcon } = useRainbowColors();
    return (
        <>
            {navItems.map((item, index) => (
                <Link
                    key={index}
                    href={item.href}
                    onMouseEnter={() => onIconMouseEnter(index)}
                    onMouseLeave={() => onIconMouseLeave()}
                >
                    <div
                        className="low-nav-icon-btn group relative flex flex-col items-center justify-center rounded-md p-3 md:p-4 transition-all duration-300">
                        <span
                            className="text-2xl"
                            style={{ color: hoveredIconIndex === index ? getColorForIcon(index) : '#8a8a8a' }}
                        >
                            {item.icon}
                        </span>
                        <span className="absolute bottom-[-45px] mb-2 text-sm font-medium bg-black/60 text-[var(--antique-parchment)] opacity-0 p-1 rounded-md group-hover:opacity-100 transition-opacity whitespace-nowrap delay-500 duration-300">
                            {item.title}
                        </span>
                    </div>
                </Link>
            ))}
        </>
    );
}
