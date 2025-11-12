import { Box, Button } from '@mui/material';

interface QuizOptionsProps {
    options: string[];
    selectedAnswer: string | null;
    correctAnswer: string;
    isAnswered: boolean;
    onAnswerSelect: (option: string) => void;
}

export default function QuizOptions({
    options,
    selectedAnswer,
    correctAnswer,
    isAnswered,
    onAnswerSelect
}: QuizOptionsProps) {
    return (
        <Box className="grid gap-3 mb-6">
            {options.map((option, index) => {
                const isSelected = selectedAnswer === option;
                const isCorrect = option === correctAnswer;
                const showCorrect = isAnswered && isCorrect;
                const showIncorrect = isAnswered && isSelected && !isCorrect;

                return (
                    <Button
                        key={index}
                        variant="outlined"
                        fullWidth
                        onClick={() => onAnswerSelect(option)}
                        disabled={isAnswered}
                        className={`py-4 text-lg font-medium rounded-xl border-2 transition-all duration-200 ${
                            showCorrect
                                ? 'bg-green-900/20 border-green-500 text-green-100 hover:bg-green-900/20'
                                : showIncorrect
                                    ? 'bg-red-900/20 border-red-500 text-red-100 hover:bg-red-900/20'
                                    : isSelected
                                        ? 'bg-purple-900/30 border-purple-500 text-purple-100 hover:bg-purple-900/30'
                                        : 'border-gray-600 text-gray-100 hover:border-purple-500 hover:bg-purple-900/10'
                        }`}
                    >
                        {option}
                        {showCorrect && ' ✓'}
                        {showIncorrect && ' ✗'}
                    </Button>
                );
            })}
        </Box>
    );
}
