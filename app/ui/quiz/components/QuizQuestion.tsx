interface QuizQuestionProps {
    quote: string;
    series: string;
    season: number;
    episode: number;
}

export default function QuizQuestion({
    quote,
}: QuizQuestionProps) {
    return (
        <div className="quiz-question">
            <p className="quiz-question__text">{quote}</p>
        </div>
    );
}
