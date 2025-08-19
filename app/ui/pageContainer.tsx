export default function PageContainer({ children }: { children: React.ReactNode }) {
    return (
        <div className="mt-10 flex flex-col items-center border rounded-lg border-pink-200 bg-[#F5F5F5] min-w-[60%] p-6">
            <div>
                {children}
            </div>
        </div>
    );
}