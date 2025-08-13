'use client';

import Link from 'next/link';
import  { selectBackgroundColor } from "../../../lib/utils";
import { MdOutlineCheckroom } from "react-icons/md";

const links = [
    {
        href: '/',
        label: 'Workroom',
        icon: MdOutlineCheckroom,
    }
];

export default function NavLinks() {

    return (
        <nav className="flex flex-col space-y-2 pb-1"> 
            {links.map((link, idx) => (
                <Link
                    key={link.href}
                    href={link.href}
                    style={{backgroundColor: selectBackgroundColor(idx)}}
                    className={
                        'flex relative items-center justify-center border p-4 w-72 rounded-md text-gray-800 font-semibold hover:bg-gray-100'
                    }
                >
                    {link.icon && <link.icon className="mr-2 absolute left-5" size={30} />}
                    {link.label}
                </Link>
            ))}
        </nav>
    );
}