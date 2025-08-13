import "./menuIcons.scss";
import { GrLounge } from "react-icons/gr";

interface MenuIconProps {
    menu: boolean;
    setMenu: (menu: boolean) => void;
}

export const MenuIcon = ({ menu, setMenu }: MenuIconProps) => {
    return (
        <div className="menu-icon-container">
            <input
                type="checkbox"
                role="button"
                aria-label="Display the menu"
                className="menu-icon"
                checked={menu}
                onChange={e => setMenu(e.target.checked)}
            />
        </div>
    );
};

const MenuIcons = ({ menu, setMenu }: MenuIconProps) => {
    return (
        <nav className="flex flex-row items-center">
            <GrLounge className="hidden md:block text-pink-500 text-4xl md:text-5xl" />
            <MenuIcon
                menu={menu}
                setMenu={setMenu}
            />
        </nav>
    );
};

export default MenuIcons;

