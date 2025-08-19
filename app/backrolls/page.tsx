'use client';

import PageContainer from "../ui/pageContainer";
import BackrollCard from "../ui/backrolls/backrollsCards";

export default function Page() {
    return (
        <main className="flex items-center min-h-screen min-w-full flex-col p-6">
                <PageContainer>
                    <div className="flex flex-col items-center justify-center w-full h-full">
                        <BackrollCard />
                    </div>
                </PageContainer>
        </main>
    );
}