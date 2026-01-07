import Link from 'next/link';

export const NavLogo = () => {
    return (
        <Link
            href="/"
            className="logo text-[2.2rem] items-center h-full">
            <span style={{
                color: 'var(--dark-pink)',
            }}>
                <span className="hidden">B.</span>
                <span className="flex">Backrolls</span>
            </span>
        </Link>
    );
};