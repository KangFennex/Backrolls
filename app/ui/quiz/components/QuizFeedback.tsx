interface QuizFeedbackProps {
    isLastQuestion: boolean;
    onNext: () => void;
}

export default function QuizFeedback({
    isLastQuestion,
    onNext
}: QuizFeedbackProps) {
    return (
        <div className="quiz-feedback">
            <button
                onClick={onNext}
                className="quiz-feedback__button"
            >
                {isLastQuestion ? 'See Results 👑' : 'Next Question →'}
            </button>
        </div>
    );
}
