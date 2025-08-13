'use client';

import { useEffect, forwardRef } from "react";
import Logo from "./logo/logo";
import Search from "../search/Search";
import MenuIcons from "./menuIcon/menuIcons";

interface NavProps {
    menu: boolean;
    setMenu: React.Dispatch<React.SetStateAction<boolean>>;
    searchModal: boolean;
    openSearchModal: () => void;
    setSearchInput: (input: string) => void; 
    clearSearchInput: () => void;
    searchInput: string,
}

function Nav({
    menu,
    setMenu,
    searchModal,
    openSearchModal,
    setSearchInput,
    clearSearchInput,
    searchInput,
}: NavProps) {

    // Close SearchModal if the menu is opened
    useEffect(() => {
        if (menu) {
            clearSearchInput();
        }
    }, [menu]);

    return (
        <div
            className="fixed top-0 w-full shadow-md h-14 bg-[#222533]"
        >
            <nav className="relative h-full mx-auto px-1 flex items-center justify-between">
                
                <div className="flex-shrink 0 ml-2 mt-1">
                    <Logo />
                </div>

                <div className="absolute left-1/2 transform -translate-x-1/2 w-full max-w-sm md:max-w-xl px-4">
                    <Search
                        searchModal={searchModal}
                        openSearchModal={openSearchModal}
                        setSearchInput={setSearchInput}
                        clearSearchInput={clearSearchInput}
                        searchInput={searchInput}
                    />
                </div>

                <div className="flex-shrink-0 ml-auto mt-2">
                    <MenuIcons
                        menu={menu}
                        setMenu={setMenu}
                    />
                </div>
            </nav>


        </div>
    );
};

Nav.displayName = 'Nav';
export default Nav;