import Link from 'next/link';

export const NavLogo = () => {
    return (
        <Link
            href="/"
            className="logo text-5xl items-center h-full">
            <span>Backrolls</span>
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

