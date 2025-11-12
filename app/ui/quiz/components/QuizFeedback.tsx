import { Box, Button } from '@mui/material';

interface QuizFeedbackProps {
    isLastQuestion: boolean;
    onNext: () => void;
}

export default function QuizFeedback({
    isLastQuestion,
    onNext
}: QuizFeedbackProps) {
    return (
        <Box className="mt-6">
            <Button
                variant="contained"
                fullWidth
                onClick={onNext}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 rounded-xl font-bold text-lg"
                size="large"
            >
                {isLastQuestion ? 'See Results 👑' : 'Next Question →'}
            </Button>
        </Box>
    );
}
