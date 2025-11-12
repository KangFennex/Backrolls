import { Card, Typography, Button, Container } from '@mui/material';

interface QuizResultsProps {
    score: number;
    totalQuestions: number;
    onRestart: () => void;
}

export default function QuizResults({
    score,
    totalQuestions,
    onRestart
}: QuizResultsProps) {
    const percentage = (score / totalQuestions) * 100;
    const isPerfect = score === totalQuestions;
    const isGood = percentage >= 70;

    return (
        <Container maxWidth="md" className="text-center">
            <Card className="p-8 bg-gradient-to-br from-gray-900 to-gray-800 border border-purple-500/20">
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
                    className={`font-bold mb-2 ${isPerfect
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
        </Container>
    );
}
