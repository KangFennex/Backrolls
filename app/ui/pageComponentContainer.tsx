import { PageComponentContainerProps } from '../lib/definitions';
import './pageComponentContainer.scss';

export default function PageComponentContainer({ children, title, subtitle }: PageComponentContainerProps) {
    return (
        <div className="PageComponentContainer w-full mt-12 pb-5">
            {(title || subtitle) && (
                <div className="page-component-container--header mb-4">
                    {title && <h2 className="text-2xl font-bold antique-parchment-text-dark">{title}</h2>}
                    {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
                </div>
            )}
            <div className="page-component-container--content w-full flex flex-col md:flex-row md:flex-wrap gap-4 md:justify-between">
                {children}
            </div>
        </div>
    );
}