import { PageComponentContainerProps } from '../lib/definitions';

export default function PageComponentContainer({ children, title, subtitle }: PageComponentContainerProps) {
    return (
        <div className="PageComponentContainer w-full md:w-[80%] md:m-auto pb-5">
            {(title || subtitle) && (
                <div className="page-component-container--header mb-4">
                    {title && <h2 className="text-2xl font-bold antique-parchment-text-dark">{title}</h2>}
                    {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
                </div>
            )}
            <div className="page-component-container--content w-[90%] m-auto md:w-full flex flex-col md:flex-row md:flex-wrap gap-4 md:justify-around">
                {children}
            </div>
        </div>
    );
}