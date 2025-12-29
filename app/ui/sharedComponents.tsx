import Link from 'next/link';
import './shared/PageSectionHeader.scss';
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

// Reusable page header
export interface PageSectionHeaderProps {
    title: string;
    subtitle?: string;
    badge?: string;
}

export const PageSectionHeader = ({ title, subtitle, badge }: PageSectionHeaderProps) => {
    return (
        <div className="page-section-header">
            {badge && <span className="page-section-header__badge">{badge}</span>}
            <h1 className="page-section-header__title backrollCard-font">{title}</h1>
            {subtitle && (
                <p className="page-section-header__subtitle">{subtitle}</p>
            )}
        </div>
    );
};

