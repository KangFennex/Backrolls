import { Box, Alert, Button } from '@mui/material';

interface QuizFeedbackProps {
    isCorrect: boolean;
    correctAnswer: string;
    isLastQuestion: boolean;
    onNext: () => void;
}

export default function QuizFeedback({
    isCorrect,
    correctAnswer,
    isLastQuestion,
    onNext
}: QuizFeedbackProps) {
    return (
        <Box className="space-y-4">
            <Alert
                severity={isCorrect ? 'success' : 'error'}
                className={`rounded-xl border ${
                    isCorrect
                        ? 'bg-green-900/20 border-green-800 text-green-100'
                        : 'bg-red-900/20 border-red-800 text-red-100'
                }`}
            >
                {isCorrect
                    ? '✓ Correct! You know your herstory!'
                    : `✗ Wrong! The correct answer was ${correctAnswer}`
                }
            </Alert>

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
