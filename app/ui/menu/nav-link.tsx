'use client';

import Link from 'next/link';
import { selectBackgroundColor } from '../../lib/utils';
import { MdOutlineWorkOutline } from 'react-icons/md';
import { RiSofaLine } from 'react-icons/ri';

const links = [
    {
        href: '/',
        label: 'Workroom',
        icon: MdOutlineWorkOutline,
    },
    {
        href: '/lounge',
        label: 'Lounge',
        icon: RiSofaLine,
    }
];

export default function NavLinks() {

    return (
        <nav className="flex flex-col space-y-3">
            {links.map((link, idx) => (
                <Link
                    key={link.href}
                    href={link.href}
                    style={{ backgroundColor: selectBackgroundColor(idx) }}
                    className={
                        'flex items-center border p-3 w-full rounded-md text-gray-800 font-semibold hover:bg-gray-100 transition-colors'
                    }
                >
                    {link.icon && <link.icon className="mr-3" size={24} />}
                    {link.label}
                </Link>
            ))}
        </nav>
    );
}