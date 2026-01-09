import { PageComponentContainerProps } from '../lib/definitions';
import { PageSectionHeader } from './shared/PageSectionHeader';

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
                <div className="page-component-container--content w-full flex flex-col px-4">
                    {children}
                </div>
            </div>
        </>
    );
}