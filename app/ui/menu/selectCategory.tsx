'use client';

import './menu.scss';
import { categories } from '../../lib/repertoire';
import { selectBackgroundColor } from "../../lib/utils"
import Link from 'next/link';

export default function selectCategory() {

    return (
        <div className="select-category flex md:flex-col text-gray-800 gap-2 items-center md:items-baseline md:justify-start md:h-full">
            {categories.map((category, idx) => (
                <Link
                    key={idx}
                    href={category.href}
                    style={{ backgroundColor: selectBackgroundColor(idx) }}
                    className="flex border rounded-md justify-center items-center cursor-pointer p-1 whitespace-nowrap flex-shrink-0 min-w-max md:w-40">
                    <h3 className="text-md font-semibold">{category.name}</h3>
                </Link>
            )
            )}
        </div>
    );
}
