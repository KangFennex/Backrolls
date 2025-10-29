'use client';

import React from "react";
import "./menu.scss";
import SelectCategory from "./selectCategory";

interface MenuProps {
    menu: boolean;
    setMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

const Menu = React.forwardRef<HTMLDivElement, MenuProps>(
    function Menu({ menu, setMenu }, ref) {
        return (
            <nav
                ref={ref}
                className="menu absolute mt-14 w-full h-full z-50 justify-start"
            >
                <SelectCategory />
            </nav>
        );
    }
);

Menu.displayName = 'Menu';

export default Menu;