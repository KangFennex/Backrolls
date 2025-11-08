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

export function BackrollCardSkeleton({ index = 0 }: { index?: number }) {
    // Use similar background logic as your real cards
    const backgrounds = [
        '#FFE4E1', '#FFEFD5', '#FFE4B5', '#FFDAB9', '#FFB6C1', '#FFC0CB',
        '#E0FFFF', '#F0F8FF', '#E6E6FA', '#DDA0DD', '#D8BFD8', '#B0E0E6',
        '#F0FFF0', '#F5FFFA', '#E0FFE0', '#AFEEEE', '#98FB98', '#C7FFDB'
    ];
    
    const backgroundColor = backgrounds[index % backgrounds.length];
    
    return (
        <div className="flex justify-center w-full mb-4">
            <Box sx={{
                width: 300,
                maxHeight: 400,
                backgroundColor: backgroundColor,
                color: 'var(--rich-charcoal)',
                border: '1px solid var(--rich-charcoal)',
                borderRadius: '8px',
                boxShadow: `
                    0 4px 8px color-mix(in srgb, var(--rich-charcoal) 15%, transparent),
                    0 2px 4px color-mix(in srgb, var(--rich-charcoal) 10%, transparent)
                `,
                overflow: 'hidden',
                position: 'relative'
            }}>
                {/* Card Header Skeleton - matches your CardHeader */}
                <div className="p-2 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Skeleton
                            variant="circular"
                            width={30}
                            height={30}
                            sx={{ backgroundColor: 'rgba(44, 44, 44, 0.2)' }}
                        />
                        <Skeleton
                            variant="text"
                            width={120}
                            height={16}
                            sx={{ backgroundColor: 'rgba(44, 44, 44, 0.2)' }}
                        />
                    </div>
                    <Skeleton
                        variant="circular"
                        width={24}
                        height={24}
                        sx={{ backgroundColor: 'rgba(44, 44, 44, 0.2)' }}
                    />
                </div>

                {/* Quote Content Skeleton - matches your backroll component */}
                <div className="px-2 py-4 flex flex-col justify-center items-center text-center min-h-[120px]">
                    <div className="text-center space-y-3 w-full">
                        {/* Quote text lines */}
                        <Skeleton
                            variant="text"
                            width="85%"
                            height={28}
                            sx={{
                                backgroundColor: 'rgba(44, 44, 44, 0.2)',
                                margin: '0 auto',
                                fontSize: '1.3rem'
                            }}
                        />
                        <Skeleton
                            variant="text"
                            width="70%"
                            height={28}
                            sx={{
                                backgroundColor: 'rgba(44, 44, 44, 0.2)',
                                margin: '0 auto',
                                fontSize: '1.3rem'
                            }}
                        />
                        <Skeleton
                            variant="text"
                            width="55%"
                            height={28}
                            sx={{
                                backgroundColor: 'rgba(44, 44, 44, 0.2)',
                                margin: '0 auto',
                                fontSize: '1.3rem'
                            }}
                        />

                        {/* Speaker Skeleton - positioned like your speaker styling */}
                        <div className="pt-3 flex justify-end pr-8">
                            <Skeleton
                                variant="text"
                                width={80}
                                height={18}
                                sx={{
                                    backgroundColor: 'rgba(44, 44, 44, 0.15)'
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Card Actions Skeleton - matches your CardActions */}
                <div className="px-2 pb-2">
                    <div className="flex items-center justify-between w-full">
                        {/* Vote buttons area */}
                        <div className="flex items-center gap-1">
                            <Skeleton
                                variant="circular"
                                width={24}
                                height={24}
                                sx={{ backgroundColor: 'rgba(44, 44, 44, 0.2)' }}
                            />
                            <Skeleton
                                variant="text"
                                width={20}
                                height={16}
                                sx={{ backgroundColor: 'rgba(44, 44, 44, 0.2)' }}
                            />
                            <Skeleton
                                variant="circular"
                                width={24}
                                height={24}
                                sx={{ backgroundColor: 'rgba(44, 44, 44, 0.2)' }}
                            />
                        </div>
                        
                        {/* Action buttons area */}
                        <div className="flex items-center gap-1">
                            {[...Array(3)].map((_, i) => (
                                <Skeleton
                                    key={i}
                                    variant="circular"
                                    width={24}
                                    height={24}
                                    sx={{ backgroundColor: 'rgba(44, 44, 44, 0.2)' }}
                                />
                            ))}
                        </div>
                        
                        {/* Expand button */}
                        <Skeleton
                            variant="circular"
                            width={24}
                            height={24}
                            sx={{ backgroundColor: 'rgba(44, 44, 44, 0.2)' }}
                        />
                    </div>
                </div>

                {/* Shimmer Effect */}
                <div className="shimmer-effect-skeleton"></div>
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
                        {[...Array(6)].map((_, index) => (
                            <BackrollCardSkeleton key={index} index={index} />
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
                {[...Array(6)].map((_, index) => (
                    <BackrollCardSkeleton key={index} index={index} />
                ))}
            </div>
        </section>
    );
}