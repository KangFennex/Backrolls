interface QuizErrorProps {
    message: string;
    onRetry: () => void;
}

export default function QuizError({ message, onRetry }: QuizErrorProps) {
    return (
        <div className="quiz-error">
            <div className="quiz-error__alert">
                <p className="quiz-error__message">
                    Error loading quiz: {message}
                </p>
                <button
                    onClick={onRetry}
                    className="quiz-error__button"
                >
                    TRY AGAIN
                </button>
            </div>
        </div>
    );
}

export function QuizEmpty({ onRetry }: { onRetry: () => void }) {
    return (
        <div className="quiz-empty">
            <h2 className="quiz-empty__title">
                No quiz questions available
            </h2>
            <button
                onClick={onRetry}
                className="quiz-empty__button"
            >
                Retry
            </button>
        </div>
    );
}
