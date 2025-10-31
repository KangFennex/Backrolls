import Link from 'next/link';

export const NavLogo = () => {
    return (
        <Link
            href="/"
            className="logo text-5xl md:text-[2.5rem] flex items-center justify-center h-full">
            <span className="block md:hidden mt-2">B.</span>
            <span className="hidden md:block">Backrolls</span>
        </Link>
    );
};

export const BackrollsLogo = () => {
    return (
        <div className="logo text-5xl text-pink-100">
            Backrolls
        </div>
    )
}

