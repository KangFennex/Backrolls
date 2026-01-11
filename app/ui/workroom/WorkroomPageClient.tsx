'use client'

import { useState, useEffect } from 'react';
import { Quote } from '../../lib/definitions';
import WorkroomHorizontalSection from './components/WorkroomHorizontalSection';
import WorkroomVerticalColumns from './components/WorkroomVerticalColumns';
import WorkroomIconicSection from './components/WorkroomIconicSection';
import Image from 'next/image';

interface WorkroomPageClientProps {
    initialData: {
        quotes: Quote[];
        nextCursor?: string;
        seed: number;
    };
}

const images = [
    { src: '/media/banner-imgs/1.jpg', alt: 'Workroom Banner Img1' },
    { src: '/media/banner-imgs/2.jpg', alt: 'Workroom Banner Img2' },
    { src: '/media/banner-imgs/3.jpg', alt: 'Workroom Banner Img3' },
    { src: '/media/banner-imgs/4.jpg', alt: 'Workroom Banner Img4' },
    { src: '/media/banner-imgs/5.png', alt: 'Workroom Banner Img5' },
    { src: '/media/banner-imgs/6.jpg', alt: 'Workroom Banner Img6' },
    { src: '/media/banner-imgs/7.jpg', alt: 'Workroom Banner Img7' },
];

export default function WorkroomPageClient({ initialData }: WorkroomPageClientProps) {
    const [visibleCount, setVisibleCount] = useState(0);

    useEffect(() => {
        const runAnimation = () => {
            // Reset to 0
            setVisibleCount(0);

            // Show images one by one
            images.forEach((_, index) => {
                setTimeout(() => {
                    setVisibleCount(index + 1);
                }, (index + 1) * 1000);
            });

            // After all images are shown (4 seconds) + 0.5 second wait, restart
            setTimeout(runAnimation, (images.length + 1) * 1000);
        };

        runAnimation();
    }, []);

    return (
        <main className="flex flex-col mt-2 pb-12">
            <span className="w-full flex mb-4">
                {images.map((image, index) => (
                    <div
                        key={index}
                        className={`transition-opacity duration-300 ${index < visibleCount ? 'opacity-100' : 'opacity-0'
                            }`}
                    >
                        <Image
                            width={200}
                            height={400}
                            src={image.src}
                            alt={image.alt} className="w-[120px] h-[200px] object-cover" />
                    </div>
                ))}
            </span>
            <WorkroomHorizontalSection initialData={initialData} />
            <WorkroomVerticalColumns />
            <WorkroomIconicSection initialData={initialData} />
        </main>
    );
}
