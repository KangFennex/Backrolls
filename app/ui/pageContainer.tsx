interface PageContainerProps {
    children: React.ReactNode;
    className?: string;
}

export default function PageContainer({ children }: PageContainerProps) {
    return (
        <div>
            {children}
        </div>
    );
}