import { PageComponentContainerProps } from '../lib/definitions';
import { PageSectionHeader } from './PageSectionHeader';

export default function PageComponentContainer({ children, title, subtitle }: PageComponentContainerProps) {
    return (
        <>
            {(title || subtitle) && (
                <PageSectionHeader
                    title={title || ''}
                    subtitle={subtitle}
                />
            )}
            <div className="PageComponentContainer w-full">
                <div className="page-component-container--content w-full flex flex-col md:px-4">
                    {children}
                </div>
            </div>
        </>
    );
}