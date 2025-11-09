import { PageComponentContainerProps } from '../lib/definitions';
import { usePathname } from 'next/navigation';
import './pageComponentContainer.scss';

export default function PageComponentContainer({ children, quotesLength }: PageComponentContainerProps) {
    const pathname = usePathname();
    const isMainPage = pathname === '/';
    const hasOctoQuotes = quotesLength !== undefined && quotesLength > 8;

    return (
        <div className={`PageComponentContainer w-full mt-6 pb-5 ${isMainPage ? 'mosaic-grid' : 'flex flex-col space-y-4 justify-center'} ${hasOctoQuotes ? 'mosaic-grid2' : ''}`}>
            {children}
        </div>
    );
}