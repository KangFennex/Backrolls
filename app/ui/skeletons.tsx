import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

export function SearchCardsSkeleton() {
    return (
        <div className='flex justify-center items-center w-full h-full pt-5'>
            <Box sx={{ width: "80%" }}>
                <Skeleton variant="text" sx={{ fontSize: '1rem', width: '50%' }}/>
                <Skeleton variant="text" sx={{ fontSize: '1rem', width: '70%' }}/>
                <Skeleton variant="text" sx={{ fontSize: '1rem', width: '100%' }}/>
            </Box>
                <div className="hidden md:block absolute bottom-0 left-0 h-[5px] w-full overflow-hidden">
                    <div className="shimmer-effect absolute h-full w-1/2 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"></div>
                </div>
        </div>
    )
}