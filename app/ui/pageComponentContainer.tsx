import { PageComponentContainerProps } from '../lib/definitions';
import { usePathname } from 'next/navigation';

export default function PageComponentContainer({ children }: PageComponentContainerProps) {
    const pathname = usePathname();
    const isMainPage = pathname === '/';

    return (
        <div className={`PageComponentContainer w-full flex justify-center space-y-4 mt-6 pb-5 ${isMainPage ? 'flex-wrap' : 'flex-col'} ${isMainPage ? 'gap-3' : ''} ${isMainPage ? 'items-center' : ''}`}>
            {children}
        </div>
    );
}