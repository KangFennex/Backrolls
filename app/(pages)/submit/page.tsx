'use client';

import PageContainer from "../../ui/pageContainer";
import Submit from "../../ui/submit/submit";

export default function Page() {
    return (
        <main className="flex items-center min-h-screen min-w-full flex-col p-6">
                <PageContainer className="h-full">
                    <div className="flex flex-col items-center justify-center w-full h-full">
                        <Submit />
                    </div>
                </PageContainer>
        </main>
    );
}