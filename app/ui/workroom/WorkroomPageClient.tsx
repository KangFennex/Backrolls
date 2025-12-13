'use client'

import { Quote } from '../../lib/definitions';
import WorkroomHorizontalSection from './components/WorkroomHorizontalSection';
import WorkroomVerticalColumns from './components/WorkroomVerticalColumns';
import WorkroomIconicSection from './components/WorkroomIconicSection';

interface WorkroomPageClientProps {
    initialData: {
        quotes: Quote[];
        nextCursor?: string;
        seed: number;
    };
}

export default function WorkroomPageClient({ initialData }: WorkroomPageClientProps) {
    return (
        <main className="flex flex-col gap-6 mt-4 pb-12 ">
            <WorkroomHorizontalSection initialData={initialData} />
            <WorkroomVerticalColumns />
            <WorkroomIconicSection initialData={initialData} />
        </main>
    );
}
