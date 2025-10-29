interface PageContainerProps {
    children: React.ReactNode;
    className?: string;
}

export default function PageContainer({ children, className }: PageContainerProps) {
    return (
        <div className={`pageContainer ${className || ''}`}>
                {children}
        </div>
    );
}