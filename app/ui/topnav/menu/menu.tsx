'use client';

import { forwardRef } from "react";
import "./menu.scss";
import { useEffect } from "react";
import NavLinks from "./nav-link";
import clsx from "clsx";
import SelectSeasons from "./selectSeasons";
import { GrLounge } from "react-icons/gr";

interface MenuProps {
    menu: boolean;
    setMenu: (value: boolean) => void;
}

const Menu = forwardRef<HTMLDivElement, MenuProps>(function Menu(
    { menu, setMenu },
    menuRef
) {
    // Close menu when clicking outside
    useEffect(() => {
        if (!menu) return;

        function handleClickOutside(event: MouseEvent) {
            const target = event.target as HTMLElement;

            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node) &&
                !target.closest('.menu-icon-container')
            ) {
                setMenu(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [menu, menuRef, setMenu]);

    return (
        <aside
            className={clsx(
                "menu absolute flex flex-col mt-14 w-full h-full items-center shadow-md pt-3 gap-5 bg-[#222533]",
                menu && "openMenu" 
            )}
            ref={menuRef}
        >
            <span className="w-full flex justify-center">
                <GrLounge className="text-pink-500 text-5xl block md:hidden" />
            </span>
            <NavLinks />
            <SelectSeasons />
            <i className="text-4xl text-center mt-3 pr-6">💅</i>
        </aside>
    );
});

export default Menu;