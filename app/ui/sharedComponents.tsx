import Link from 'next/link';
// import { useRainbowColors } from '../lib/hooks/useRainbowColors';

export const NavLogo = () => {
    // const { getColorForIcon, transitionDuration } = useRainbowColors(10000); // 10 seconds

    return (
        <Link
            href="/"
            className="logo text-5xl items-center h-full">
            <span style={{
                color: 'var(--dark-pink)', //getColorForIcon(0),
                // transition: `color ${transitionDuration}ms ease-in-out`
            }}>
                Backrolls

            </span>
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

