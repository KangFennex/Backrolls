import { PageComponentContainerProps } from '../lib/definitions';
import { usePathname } from 'next/navigation';

export default function PageComponentContainer({ children }: PageComponentContainerProps) {
    const pathname = usePathname();
    const isMainPage = pathname === '/';

    return (
        <div className={`PageComponentContainer w-full flex justify-center mt-6 pb-5 space-y-4 ${isMainPage ? 'flex-wrap gap-3 items-center' : 'flex-col'}`}>
            {children}
        </div>
    );
}