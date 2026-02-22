import '@/app/scss/components/Skeleton.scss';
import BackrollCardSlimSkeleton from '../backrollCards/BackrollCardSlimSkeleton';

export function SearchCardsSkeleton() {
    return (
        <div className="flex flex-col gap-3 w-full px-4 py-8">
            <div className="sk sk--text animate-pulse" style={{ width: '58%', height: 14, borderRadius: 8 }} />
            <div className="sk sk--text animate-pulse" style={{ width: '76%', height: 14, borderRadius: 8 }} />
            <div className="sk sk--text animate-pulse" style={{ width: '92%', height: 14, borderRadius: 8 }} />
        </div>
    );
}

export function MainPageSkeleton() {
    return (
        <div className="app-layout">
            {/* Header - minimal placeholder */}
            <div className="fixed top-0 left-0 w-full z-50 bg-[var(--rich-charcoal)] border-b border-gray-700">
                <div className="flex items-center justify-between p-4">
                    <div className="sk sk--text-lg" style={{ width: 120, height: 32 }} />
                    <div className="flex items-center gap-4">
                        <div className="sk sk--text" style={{ width: 200, height: 36, borderRadius: '18px' }} />
                        <div className="sk sk--circle" style={{ width: 32, height: 32 }} />
                    </div>
                </div>
            </div>

            {/* Filter Bar - icon placeholders */}
            <div className="fixed top-[70px] left-0 w-full z-40 bg-[var(--rich-charcoal)] border-b border-gray-600">
                <div className="flex items-center justify-center gap-6 py-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="sk sk--circle" style={{ width: 40, height: 40 }} />
                    ))}
                </div>
            </div>

            {/* Main Content - card skeletons */}
            <div className="w-full pt-32 pb-8">
                <div className="w-full max-w-4xl mx-auto px-4">
                    <div className="flex flex-col gap-4">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <BackrollCardSlimSkeleton key={i} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export function SectionSkeleton() {
    return (
        <section className="flex flex-col w-full gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
                <BackrollCardSlimSkeleton key={i} />
            ))}
        </section>
    );
}

export function BackrollDetailSkeleton() {
    return (
        <div className="backroll-detail-layout">
            <div className="backroll-detail-main">
                {/* Breadcrumb */}
                <div className="backroll-detail-breadcrumb">
                    <div className="sk sk--text" style={{ width: 250, height: 20 }} />
                </div>

                {/* Quote Text */}
                <div className="backroll-detail-quote" style={{ gap: '1rem' }}>
                    <div className="sk sk--text-lg" style={{ width: '90%', height: 24 }} />
                    <div className="sk sk--text-lg" style={{ width: '75%', height: 24 }} />
                    <div className="sk sk--text" style={{ width: 150, height: 20, marginTop: '0.5rem' }} />
                </div>

                {/* Image */}
                <div className="sk sk--image" style={{ width: '100%', height: 400, borderRadius: 12 }} />

                {/* Action Buttons */}
                <div className="backroll-detail-stats" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div className="sk sk--circle" style={{ width: 40, height: 40 }} />
                    <div className="sk sk--circle" style={{ width: 40, height: 40 }} />
                    <div className="sk sk--circle" style={{ width: 40, height: 40 }} />
                    <div className="sk sk--text" style={{ width: 60, height: 24, marginLeft: 'auto' }} />
                </div>

                {/* Stats Section */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
                    <div className="sk sk--text" style={{ width: 200, height: 20 }} />
                    <div className="sk sk--text" style={{ width: 180, height: 20 }} />
                    <div className="sk sk--text" style={{ width: 220, height: 20 }} />
                </div>
            </div>

            {/* Horizontal Section */}
            <div className="backroll-detail-horizontal-section">
                <div className="sk sk--text-lg" style={{ width: 200, height: 24, marginBottom: '1rem' }} />
                <div className="horizontal-quotes-container">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="sk sk--image" style={{ minWidth: 300, height: 150, borderRadius: 8 }} />
                    ))}
                </div>
            </div>
        </div>
    );
}