import { PageComponentContainerProps } from '../lib/definitions';
import { PageSectionHeader } from './sharedComponents';

export default function PageComponentContainer({ children, title, subtitle }: PageComponentContainerProps) {
    return (
        <>
            {(title || subtitle) && (
                <PageSectionHeader
                    title={title || ''}
                    subtitle={subtitle}
                />
            )}
            <div className="PageComponentContainer w-full md:w-[80%] md:m-auto pb-5">
                <div className="page-component-container--content w-[90%] m-auto md:w-full flex flex-col md:flex-row md:flex-wrap gap-4 md:justify-around">
                    {children}
                </div>
            </div>
        </>
    );
}