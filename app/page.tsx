import WorkroomPageClient from './ui/workroom/WorkroomPageClient';
import PageContainer from './ui/pageContainer';
import { appRouter } from './server';
import { createContext } from './server/context';

export default async function WorkroomPage() {
  // Fetch initial data on the server
  const ctx = await createContext();
  const caller = appRouter.createCaller(ctx);

  const initialData = await caller.quotes.getRandom({ limit: 30 });

  return (
    <>
      <PageContainer>
        <WorkroomPageClient initialData={initialData} />
      </PageContainer>
    </>
  );
}
