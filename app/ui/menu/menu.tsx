'use client';

import "./menu.scss";
import SelectCategory from "./selectCategory";

export default function Menu() {
    return (
        <nav
            className="menu absolute mt-14 w-full h-full z-50 justify-start"
        >
            <SelectCategory />
        </nav>
    );
};

Menu.displayName = 'Menu';

/*     // Close menu when clicking outside
    useEffect(() => {
        if (!menu) return;

        function handleClickOutside(event: MouseEvent) {
            const target = event.target as HTMLElement;
            const currentRef = ref as React.RefObject<HTMLDivElement>;

            if (
                currentRef.current &&
                !currentRef.current.contains(event.target as Node) &&
                !target.closest('.menu-icon-container')
            ) {
                setMenu(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [menu, ref, setMenu]); */