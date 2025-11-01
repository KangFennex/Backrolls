'use client';

import React from "react";
import "./menu.scss";
import SelectCategory from "./selectCategory";
import NavLinks from "./nav-link";
import { IoClose } from "react-icons/io5";

interface MenuProps {
    closeSideMenu: () => void;
}

const Menu = React.forwardRef<HTMLDivElement, MenuProps>(
    function Menu({ closeSideMenu }, ref) {
        return (
            <nav
                ref={ref}
                className="menu w-full h-full flex flex-col bg-white"
            >
                {/* Header with close button */}
                <div className="flex ml-auto items-center p-4 border-b border-gray-200">
                    <button
                        onClick={closeSideMenu}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        aria-label="Close menu"
                    >
                        <IoClose size={30} className="text-pink-500" />
                    </button>
                </div>

                {/* Navigation Links */}
                <div className="p-4 border-b border-gray-200">
                    <NavLinks />
                </div>

                {/* Categories */}
                <div className="p-4 flex-1">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Categories</h3>
                    <SelectCategory />
                </div>
            </nav>
        );
    }
);

Menu.displayName = 'Menu';

export default Menu;