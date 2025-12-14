import Link from 'next/link';
// import { useRainbowColors } from '../lib/hooks/useRainbowColors';

export const NavLogo = () => {
    return (
        <Link
            href="/"
            className="logo text-[2.5rem] items-center h-full">
            <span style={{
                color: 'var(--dark-pink)',
            }}>
                <span className="md:hidden">B.</span>
                <span className="hidden md:inline">Backrolls</span>
            </span>
        </Link>
    );
};

export const BackrollsLogo = () => {
    return (
        <div className="logo text-5xl items-center h-full cursor-default">
            <span style={{
                color: 'var(--dark-pink)',
            }}>
                Backrolls
            </span>
        </div>
    );
}

