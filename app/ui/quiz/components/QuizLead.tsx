interface QuizLeadProps {
    onStartQuiz: () => void;
}

export default function QuizLead({ onStartQuiz }: QuizLeadProps) {
    return (
        <div className="quiz-lead">
            <h1 className="quiz-lead__title">Welcome to the Backrolls Quiz!</h1>
            <p className="quiz-lead__description">
                We know you&apos;ve got backrolls, but how well do you really know them? The stage is yours. And remember, do not fuck it up!
            </p>
            <button
                onClick={onStartQuiz}
                className="quiz-lead__button"
            >
                Start Quiz
            </button>
        </div>
    );
}