import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

/*
// Loading animation
const shimmer =
    "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent";

export function SearchCardSkeleton() {
    return (
        <div className="w-[90%] min-h-[100px] overflow-hidden bg-[#36374d] p-[20px_34px] rounded-[10px] border-l-[5px] border-l-[hsl(327,81%,60%)] md:min-w-130">
            <span className="relative z-10">Where am I?</span>
        </div>
    )
}
*/

export function SearchCardsSkeleton() {
    return (
        <div className='flex justify-center items-center w-full'>
            <Box sx={{ width: "70%" }}>
                <Skeleton variant="text" sx={{ fontSize: '2.5rem' }}/>
                <Skeleton variant="text" sx={{ fontSize: '2.5rem' }}/>
                <Skeleton variant="text" sx={{ fontSize: '2.5rem' }}/>
            </Box>
        </div>
    )
}