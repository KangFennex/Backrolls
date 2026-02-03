'use client'

import { Quote } from '../../lib/definitions';
import WorkroomHorizontalSection from './components/WorkroomHorizontalSection';
import WorkroomVerticalColumns from './components/WorkroomVerticalColumns';
import WorkroomIconicSection from './components/WorkroomIconicSection';
import Image from 'next/image';
import bannerImg from '../../../public/media/banner/newBanner.gif';

interface WorkroomPageClientProps {
    initialData: {
        quotes: Quote[];
        nextCursor?: string;
        seed: number;
    };
}

export default function WorkroomPageClient({ initialData }: WorkroomPageClientProps) {

    return (
        <main className="flex flex-col mt-2 pb-12">
            <span className="w-full flex mb-4">
                <Image
                    width={600}
                    height={200}
                    src={bannerImg}
                    alt="Workroom Banner"
                    className="w-full h-auto object-cover mx-auto"
                />
            </span>
            <WorkroomHorizontalSection initialData={initialData} />
            <WorkroomVerticalColumns />
            <WorkroomIconicSection initialData={initialData} />
        </main>
    );
}
