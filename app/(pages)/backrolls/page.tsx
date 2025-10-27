'use client';

import PageContainer from "../../ui/pageContainer";
import BackrollCardsWrapper from "../../ui/backrolls/backrollsCards";

export default function Page() {
    return (
        <main className="flex min-h-screen min-w-full flex-col">
            <PageContainer>
                <BackrollCardsWrapper />
            </PageContainer>
        </main>
    );
}