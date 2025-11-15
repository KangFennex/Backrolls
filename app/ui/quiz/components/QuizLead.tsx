import { Container } from "@mui/material";

interface QuizLeadProps {
    onStartQuiz: () => void;
}

export default function QuizLead({ onStartQuiz }: QuizLeadProps) {
    return (
        <Container className="flex flex-col items-center justify-center min-h-[300px] p-6 mb-6 rounded-xl gap-3 border border-gray-700 bg-transparent text-white hover:bg-[var(--hover-bg-color)]" sx={{
            backgroundColor: 'rgba(255, 255, 240, 0.1)',
        }}>
            <h1 className="backrollCard-font text-5xl font-bold mb-6 text-center">Welcome to the Backrolls Quiz!</h1>
            <p className="text-4xl mb-8 text-center">
                We know you&apos;ve got backrolls, but how well do you really know them? The stage is yours. And remember, do not fuck it up!
            </p>
            <button
                onClick={onStartQuiz}
                className="text-2xl px-6 py-3 text-black rounded-lg border border-gray-700 bg-pink-100 "
            >
                Start Quiz
            </button>
        </Container>
    );
}