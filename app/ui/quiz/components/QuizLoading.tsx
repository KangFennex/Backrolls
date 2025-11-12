import { Container, CircularProgress, Typography } from '@mui/material';

export default function QuizLoading() {
    return (
        <Container maxWidth="md" className="flex flex-col items-center justify-center min-h-96">
            <CircularProgress size={60} className="mb-4 text-purple-500" />
            <Typography variant="h6" className="text-gray-400">
                Loading fabulous quotes...
            </Typography>
        </Container>
    );
}
