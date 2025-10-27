import Workroom from './ui/workroom/workroom';
import PageContainer from './ui/pageContainer';

export default function HomePage() {

  return (
    <main className="flex items-center min-h-screen min-w-full flex-col">
      <PageContainer>
        <Workroom />
      </PageContainer>
    </main>
  );
}
