import { Card, Typography, Button, Container, Box, Divider } from '@mui/material';

interface UserAnswer {
    questionIndex: number;
    selectedAnswer: string;
    correctAnswer: string;
    quote: string;
    isCorrect: boolean;
}

interface QuizResultsProps {
    score: number;
    totalQuestions: number;
    userAnswers: UserAnswer[];
    onRestart: () => void;
}

export default function QuizResults({
    score,
    totalQuestions,
    userAnswers,
    onRestart
}: QuizResultsProps) {
    const percentage = (score / totalQuestions) * 100;
    const isPerfect = score === totalQuestions;
    const isGood = percentage >= 70;

    return (
        <Container maxWidth="md" className="text-center">
            <Card className="p-8 bg-gradient-to-br from-gray-900 to-gray-800 border border-purple-500/20 mb-6" sx={{ backgroundColor: 'transparent' }}>
                <div className="mb-6">
                    {isPerfect ? (
                        <Typography variant="h3" className="text-yellow-400 mb-2">
                            👑 Yes Mama!
                        </Typography>
                    ) : isGood ? (
                        <Typography variant="h4" className="text-green-400 mb-2">
                            💅 You&apos;re a Winner Baby!
                        </Typography>
                    ) : (
                        <Typography variant="h4" className="text-pink-400 mb-2">
                            ❤️ You can are safe! But girl, in this economy...
                        </Typography>
                    )}
                </div>

                <Typography
                    variant="h2"
                    className={`font-bold mb-2 ${
                        isPerfect
                            ? 'text-yellow-400'
                            : isGood
                                ? 'text-green-400'
                                : 'text-pink-400'
                    }`}
                >
                    {score} / {totalQuestions}
                </Typography>

                <Typography variant="h6" className="text-gray-400 mb-6">
                    {percentage.toFixed(0)}% Correct
                </Typography>

                <Button
                    variant="contained"
                    onClick={onRestart}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-full font-bold text-lg"
                    size="large"
                >
                    Shantay, You Stay! (Play Again)
                </Button>
            </Card>

            {/* Answer Review Section */}
            <Box className="space-y-4">
                <Typography variant="h5" className="text-gray-200 mb-4 text-left">
                    Review Your Answers
                </Typography>
                
                {userAnswers.map((answer, index) => (
                    <Card 
                        key={index} 
                        className={`p-4 text-left border-2 ${
                            answer.isCorrect 
                                ? 'border-green-500 bg-green-900/10' 
                                : 'border-red-500 bg-red-900/10'
                        }`}
                        sx={{ backgroundColor: 'transparent' }}
                    >
                        <Box className="flex items-start gap-3">
                            <Typography 
                                variant="h6" 
                                className={`font-bold ${
                                    answer.isCorrect ? 'text-green-400' : 'text-red-400'
                                }`}
                            >
                                {answer.isCorrect ? '✓' : '✗'}
                            </Typography>
                            
                            <Box className="flex-1">
                                <Typography variant="body1" className="text-gray-300 italic mb-2">
                                    &ldquo;{answer.quote}&rdquo;
                                </Typography>
                                
                                <Divider className="my-2 bg-gray-700" />
                                
                                <Box className="space-y-1">
                                    <Typography variant="body2" className="text-gray-400">
                                        <span className="font-semibold">Your answer:</span>{' '}
                                        <span className={answer.isCorrect ? 'text-green-400' : 'text-red-400'}>
                                            {answer.selectedAnswer}
                                        </span>
                                    </Typography>
                                    
                                    {!answer.isCorrect && (
                                        <Typography variant="body2" className="text-gray-400">
                                            <span className="font-semibold">Correct answer:</span>{' '}
                                            <span className="text-green-400">
                                                {answer.correctAnswer}
                                            </span>
                                        </Typography>
                                    )}
                                </Box>
                            </Box>
                        </Box>
                    </Card>
                ))}
            </Box>
        </Container>
    );
}
