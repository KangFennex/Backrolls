import { Box, Button } from '@mui/material';

interface QuizOptionsProps {
    options: string[];
    selectedAnswer: string | null;
    correctAnswer: string; // Kept for interface compatibility
    isAnswered: boolean;
    onAnswerSelect: (option: string) => void;
}

export default function QuizOptions({
    options,
    selectedAnswer,
    isAnswered,
    onAnswerSelect
}: QuizOptionsProps) {
    return (
        <Box className="grid gap-3 mb-6">
            {options.map((option, index) => {
                const isSelected = selectedAnswer === option;

                return (
                    <Button
                        key={index}
                        variant="outlined"
                        fullWidth
                        onClick={() => onAnswerSelect(option)}
                        disabled={isAnswered}
                        className={`py-4 text-lg font-medium rounded-xl border-2 transition-all duration-200 ${
                            isSelected
                                ? 'bg-purple-900/30 border-purple-500 text-purple-100 hover:bg-purple-900/30'
                                : 'border-gray-600 text-gray-100 hover:border-purple-500 hover:bg-purple-900/10'
                        }`}
                    >
                        {option}
                    </Button>
                );
            })}
        </Box>
    );
}
