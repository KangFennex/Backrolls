interface QuizOptionsProps {
    options: string[];
    selectedAnswer: string | null;
    correctAnswer: string;
    isAnswered: boolean;
    onAnswerSelect: (option: string) => void;
}

export default function QuizOptions({
    options,
    selectedAnswer,
    isAnswered,
    onAnswerSelect
}: QuizOptionsProps) {
    return (
        <div className="quiz-options">
            {options.map((option, index) => {
                const isSelected = selectedAnswer === option;

                return (
                    <button
                        key={index}
                        onClick={() => onAnswerSelect(option)}
                        disabled={isAnswered}
                        className={`quiz-option ${isSelected ? 'quiz-option--selected' : ''
                            }`}
                    >
                        <span>{option}</span>
                    </button>
                );
            })}
        </div>
    );
}
