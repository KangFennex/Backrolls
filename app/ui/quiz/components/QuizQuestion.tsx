import { Card, Typography } from '@mui/material';

interface QuizQuestionProps {
    quote: string;
    series: string;
    season: number;
    episode: number;
}

export default function QuizQuestion({
    quote,
}: QuizQuestionProps) {
    return (
        <Card className="p-6 mb-6 rounded-xl border border-gray-700 transition-all duration-200 hover:bg-green-900/20 text-center bg-transparent" sx={{ backgroundColor: 'transparent' }}>
            <Typography
                variant="h5"
                className="py-4 text-lg font-medium text-white mb-4 leading-relaxed italic"
            >
                &ldquo;{quote}&rdquo;
            </Typography>
        </Card>
    );
}
