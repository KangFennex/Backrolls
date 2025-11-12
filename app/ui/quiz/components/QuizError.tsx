import { Container, Alert, Button, Typography } from '@mui/material';

interface QuizErrorProps {
    message: string;
    onRetry: () => void;
}

export default function QuizError({ message, onRetry }: QuizErrorProps) {
    return (
        <Container maxWidth="md">
            <Alert
                severity="error"
                className="mb-4 bg-red-900/20 border border-red-800"
                action={
                    <Button
                        color="inherit"
                        size="small"
                        onClick={onRetry}
                        className="text-red-300"
                    >
                        TRY AGAIN
                    </Button>
                }
            >
                Error loading quiz: {message}
            </Alert>
        </Container>
    );
}

export function QuizEmpty({ onRetry }: { onRetry: () => void }) {
    return (
        <Container maxWidth="md" className="text-center">
            <Typography variant="h6" className="text-gray-400 mb-4">
                No quiz questions available
            </Typography>
            <Button
                variant="outlined"
                onClick={onRetry}
                className="border-purple-500 text-purple-400 hover:bg-purple-900/20"
            >
                Retry
            </Button>
        </Container>
    );
}
