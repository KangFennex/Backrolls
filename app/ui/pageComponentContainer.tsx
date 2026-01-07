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
            <div className="PageComponentContainer w-full md:m-auto">
                <div className="page-component-container--content m-auto w-full flex flex-col md:flex-row md:flex-wrap md:justify-around">
                    {children}
                </div>
            </div>
        </>
    );
}