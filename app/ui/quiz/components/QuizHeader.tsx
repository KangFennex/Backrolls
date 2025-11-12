import { Box, Card, Chip, LinearProgress } from '@mui/material';

interface QuizHeaderProps {
    currentQuestion: number;
    totalQuestions: number;
    score: number;
    progress: number;
}

export default function QuizHeader({
    currentQuestion,
    totalQuestions,
    score,
    progress
}: QuizHeaderProps) {
    return (
        <Card className="p-6 mb-6 bg-gray-900/50 border border-gray-700" sx={{ backgroundColor: 'transparent' }}>
            <Box className="flex justify-between items-center mb-4">
                <Chip
                    label={`Question ${currentQuestion} of ${totalQuestions}`}
                    sx={{ backgroundColor: '#1f2937', color: '#f3f4f6' }}
                    className=""
                />
                <Chip
                    label={`Score: ${score}`}
                    sx={{ backgroundColor: '#1f2937', color: '#f3f4f6' }}
                    className=""
                />
            </Box>

            <LinearProgress
                variant="determinate"
                value={progress}
                className="h-2 rounded-full bg-gray-700"
                sx={{
                    '& .MuiLinearProgress-bar': {
                        backgroundColor: '#a855f7',
                        borderRadius: '4px'
                    }
                }}
            />
        </Card>
    );
}
