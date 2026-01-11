import '@/app/scss/components/PageSectionHeader.scss';
// import { useRainbowColors } from '../lib/hooks/useRainbowColors';


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

