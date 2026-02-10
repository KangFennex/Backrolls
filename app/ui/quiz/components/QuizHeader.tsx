interface QuizHeaderProps {
    currentQuestion: number;
    totalQuestions: number;
    score: number;
    progress: number;
}

export default function QuizHeader({
    currentQuestion,
    totalQuestions,
    score,
    progress
}: QuizHeaderProps) {
    return (
        <div className="quiz-header">
            <div className="quiz-header__stats">
                <span className="quiz-header__chip">
                    Question {currentQuestion} of {totalQuestions}
                </span>
                <span className="quiz-header__chip">
                    Score: {score}
                </span>
            </div>

            <div className="quiz-header__progress">
                <div
                    className="quiz-header__progress-bar"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
}
