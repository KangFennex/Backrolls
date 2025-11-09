import { PageComponentContainerProps } from '../lib/definitions';
import './pageComponentContainer.scss';

export default function PageComponentContainer({ children, variant = 'list' }: PageComponentContainerProps) {
    // variant options:
    // 'mosaic' - Grid layout with spanning cards (for 8+ quotes or main page)
    // 'list' - Vertical list layout (for < 8 quotes)

    return (
        <div className={`PageComponentContainer w-full mt-6 pb-5 ${variant === 'mosaic' ? 'mosaic-grid' : 'flex flex-col space-y-4 justify-center'}`}>
            {children}
        </div>
    );
}