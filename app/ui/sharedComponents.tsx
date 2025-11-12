import Link from 'next/link';
// import { useRainbowColors } from '../lib/hooks/useRainbowColors';

export const NavLogo = () => {
    // const { getColorForIcon, transitionDuration } = useRainbowColors(10000); // 10 seconds

    return (
        <Link
            href="/"
            className="logo text-5xl items-center h-full">
            <span style={{
                color: 'var(--dark-pink)',
            }}>
                Backrolls

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

