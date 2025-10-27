export default function PageContainer({ children }: { children: React.ReactNode }) {
    return (
        <div className="pageContainer">
                {children}
        </div>
    );
}