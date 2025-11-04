import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

export function SearchCardsSkeleton() {
    return (
        <div className='flex justify-center items-center w-full h-full pt-5'>
            <Box sx={{ width: "80%" }}>
                <Skeleton variant="text" sx={{ fontSize: '1rem', width: '50%' }} />
                <Skeleton variant="text" sx={{ fontSize: '1rem', width: '70%' }} />
                <Skeleton variant="text" sx={{ fontSize: '1rem', width: '100%' }} />
            </Box>
            <div className="hidden md:block absolute bottom-0 left-0 h-[5px] w-full overflow-hidden">
                <div className="shimmer-effect absolute h-full w-1/2 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"></div>
            </div>
        </div>
    )
}

export function BackrollCardSkeleton() {
    return (
        <div className="w-full mb-4">
            <Box sx={{
                width: '100%',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 240, 0.1)',
                overflow: 'hidden',
                position: 'relative'
            }}>
                {/* Card Header Skeleton */}
                <div className="p-4 pb-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Skeleton
                                variant="circular"
                                width={24}
                                height={24}
                                sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                            />
                            <Skeleton
                                variant="text"
                                width={120}
                                height={16}
                                sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                            />
                        </div>
                        <Skeleton
                            variant="circular"
                            width={20}
                            height={20}
                            sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                        />
                    </div>
                </div>

                {/* Quote Content Skeleton */}
                <div className="px-6 py-8">
                    <div className="text-center space-y-4">
                        <Skeleton
                            variant="text"
                            width="90%"
                            height={32}
                            sx={{
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                margin: '0 auto',
                                fontSize: '1.5rem'
                            }}
                        />
                        <Skeleton
                            variant="text"
                            width="75%"
                            height={32}
                            sx={{
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                margin: '0 auto',
                                fontSize: '1.5rem'
                            }}
                        />
                        <Skeleton
                            variant="text"
                            width="60%"
                            height={32}
                            sx={{
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                margin: '0 auto',
                                fontSize: '1.5rem'
                            }}
                        />

                        {/* Speaker Skeleton */}
                        <div className="pt-4">
                            <Skeleton
                                variant="text"
                                width="40%"
                                height={20}
                                sx={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                                    margin: '0 auto'
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Card Actions Skeleton */}
                <div className="px-4 pb-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <Skeleton
                                    variant="circular"
                                    width={20}
                                    height={20}
                                    sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                                />
                                <Skeleton
                                    variant="circular"
                                    width={20}
                                    height={20}
                                    sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                                />
                                <Skeleton
                                    variant="text"
                                    width={30}
                                    height={16}
                                    sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <Skeleton
                                    variant="circular"
                                    width={20}
                                    height={20}
                                    sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                                />
                                <Skeleton
                                    variant="circular"
                                    width={20}
                                    height={20}
                                    sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                                />
                                <Skeleton
                                    variant="circular"
                                    width={20}
                                    height={20}
                                    sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                                />
                            </div>
                        </div>
                        <Skeleton
                            variant="circular"
                            width={24}
                            height={24}
                            sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                        />
                    </div>
                </div>

                {/* Shimmer Effect */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="shimmer-effect-skeleton"></div>
                </div>
            </Box>
        </div>
    );
}

export function MainPageSkeleton() {
    return (
        <div className="app-layout">
            {/* Header Skeleton */}
            <div className="fixed top-0 left-0 w-full z-50 bg-[var(--rich-charcoal)] border-b border-gray-700">
                <div className="flex items-center justify-between p-4">
                    <Skeleton
                        variant="text"
                        width={120}
                        height={32}
                        sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                    />
                    <div className="flex items-center gap-4">
                        <Skeleton
                            variant="rectangular"
                            width={200}
                            height={36}
                            sx={{
                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                borderRadius: '18px'
                            }}
                        />
                        <Skeleton
                            variant="circular"
                            width={32}
                            height={32}
                            sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                        />
                    </div>
                </div>
            </div>

            {/* Filter Bar Skeleton */}
            <div className="fixed top-[70px] left-0 w-full z-40 bg-[var(--rich-charcoal)] border-b border-gray-600">
                <div className="flex items-center justify-center py-3">
                    <div className="flex items-center gap-6">
                        {[...Array(6)].map((_, i) => (
                            <Skeleton
                                key={i}
                                variant="circular"
                                width={40}
                                height={40}
                                sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content Skeleton */}
            <div className="w-full pt-32 pb-8">
                <div className="w-full max-w-4xl mx-auto px-4">
                    {/* Card Skeletons */}
                    <div className="flex flex-col gap-4">
                        {[...Array(3)].map((_, index) => (
                            <BackrollCardSkeleton key={index} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export function SectionSkeleton() {
    return (
        <section className="flex flex-col w-full h-auto">
            <div className="flex flex-col w-full gap-4">
                {[...Array(3)].map((_, index) => (
                    <BackrollCardSkeleton key={index} />
                ))}
            </div>
        </section>
    );
}