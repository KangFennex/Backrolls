import { PageComponentContainerProps } from '../lib/definitions';

export default function PageComponentContainer({ children }: PageComponentContainerProps) {
    return (
        <div className="w-full flex flex-col justify-center space-y-4 mt-6">
            {children}
        </div>
    );
}