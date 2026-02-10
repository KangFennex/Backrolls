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
    const isSafe = percentage >= 40 && percentage < 70;

    const getResultClass = () => {
        if (isPerfect) return 'perfect';
        if (isGood) return 'good';
        if (isSafe) return 'safe';
        return 'eliminated';
    };

    const resultClass = getResultClass();

    return (
        <div className="quiz-results">
            <div className="quiz-results__summary">
                <div>
                    {isPerfect ? (
                        <h2 className={`quiz-results__title quiz-results__title--${resultClass}`}>
                            💅 You&apos;re a Winner Baby!
                        </h2>
                    ) : isGood ? (
                        <h2 className={`quiz-results__title quiz-results__title--${resultClass}`}>
                            👑 Yes Mama!
                        </h2>
                    ) : isSafe ? (
                        <h2 className={`quiz-results__title quiz-results__title--${resultClass}`}>
                            ❤️ You are safe! But girl, in this economy...
                        </h2>
                    ) : (
                        <h2 className={`quiz-results__title quiz-results__title--${resultClass}`}>
                            💔 I&apos;m sorry my dear, but you are up for elimination!
                        </h2>
                    )}
                </div>

                <div className={`quiz-results__score quiz-results__score--${resultClass}`}>
                    {score} / {totalQuestions}
                </div>

                <p className="quiz-results__percentage">
                    {percentage.toFixed(0)}% Correct
                </p>

                <button
                    onClick={onRestart}
                    className="quiz-results__restart-button"
                >
                    Shantay, You Stay! (Play Again)
                </button>
            </div>

            {/* Answer Review Section */}
            <div className="quiz-results__review">
                <h3 className="quiz-results__review-title">
                    Review Your Answers
                </h3>

                {userAnswers.map((answer, index) => (
                    <div
                        key={index}
                        className={`quiz-results__answer ${answer.isCorrect
                                ? 'quiz-results__answer--correct'
                                : 'quiz-results__answer--incorrect'
                            }`}
                    >
                        <div className="quiz-results__answer-header">
                            <span className="quiz-results__answer-icon">
                                {answer.isCorrect ? '✅' : '❌'}
                            </span>
                            <span className={`quiz-results__answer-number ${answer.isCorrect
                                    ? 'quiz-results__answer-number--correct'
                                    : 'quiz-results__answer-number--incorrect'
                                }`}>
                                Question {index + 1}
                            </span>
                        </div>

                        <p className="quiz-results__answer-quote">
                            &ldquo;{answer.quote}&rdquo;
                        </p>

                        <div className="quiz-results__answer-details">
                            <span className="quiz-results__answer-label">Your answer:</span>
                            <span className={`quiz-results__answer-value ${answer.isCorrect ? '' : 'quiz-results__answer-value--your'
                                }`}>
                                {answer.selectedAnswer}
                            </span>
                        </div>

                        {!answer.isCorrect && (
                            <div className="quiz-results__answer-details">
                                <span className="quiz-results__answer-label">Correct answer:</span>
                                <span className="quiz-results__answer-value quiz-results__answer-value--correct">
                                    {answer.correctAnswer}
                                </span>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
