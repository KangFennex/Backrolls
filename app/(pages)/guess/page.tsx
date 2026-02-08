import PageContainer from '../../ui/shared/pageContainer';
import GuessPageClient from '../../ui/guess/GuessPageClient';
import { appRouter } from '../../server';
import { createContext } from '../../server/context';

export default async function GuessPage() {
    // Fetch initial random data on the server
    const ctx = await createContext();
    const caller = appRouter.createCaller(ctx);

    const initialData = await caller.quotes.getRandom({ limit: 30 });

    return (
        <>
            <PageContainer>
                <GuessPageClient initialData={initialData} />
            </PageContainer>
        </>
    )
}