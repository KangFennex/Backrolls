'use client';

import PageContainer from "../../ui/pageContainer";
import Submit from "../../ui/submit/submit";

export default function Page() {
    return (
        <main>
            <PageContainer>
                <div className="flex flex-col items-center justify-center w-full h-full">
                    <Submit />
                </div>
            </PageContainer>
        </main>
    );
}