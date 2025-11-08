import { PageComponentContainerProps } from '../lib/definitions';
import { usePathname } from 'next/navigation';
import './pageComponentContainer.scss';

export default function PageComponentContainer({ children }: PageComponentContainerProps) {
    const pathname = usePathname();
    const isMainPage = pathname === '/';

    return (
        <div className={`PageComponentContainer w-full mt-6 pb-5 ${isMainPage ? 'mosaic-grid' : 'flex flex-col space-y-4 justify-center'}`}>
            {children}
        </div>
    );
}