'use client';

import React from "react";
import "./menu.scss";
import SelectCategory from "./selectCategory";

interface MenuProps {
    menu: boolean;
    setMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

const Menu = React.forwardRef<HTMLDivElement, MenuProps>(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function Menu({ menu, setMenu }, ref) {
        return (
            <nav
                ref={ref}
                className="menu w-full flex flex-col"
            >
                <SelectCategory />
            </nav>
        );
    }
);

Menu.displayName = 'Menu';

export default Menu;