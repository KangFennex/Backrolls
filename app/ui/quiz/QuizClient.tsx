'use client';

import { useState } from 'react';
import { Container } from '@mui/material';
import { useQuizQuotes } from '../../lib/hooks/useQuizQuotes';
import PageComponentContainer from '../pageComponentContainer';
import {
    QuizHeader,
    QuizQuestion,
    QuizOptions,
    QuizFeedback,
    QuizResults,
    QuizLoading,
    QuizError,
    QuizEmpty
} from './components';

export default function QuizClient() {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set());

    const { data: questions, isLoading, error, refetch } = useQuizQuotes(10);

    if (isLoading) {
        return (
            <PageComponentContainer variant="list">
                <QuizLoading />
            </PageComponentContainer>
        );
    }

    if (error) {
        return (
            <PageComponentContainer variant="list">
                <QuizError message={error.message} onRetry={() => refetch()} />
            </PageComponentContainer>
        );
    }

    if (!questions || questions.length === 0) {
        return (
            <PageComponentContainer variant="list">
                <QuizEmpty onRetry={() => refetch()} />
            </PageComponentContainer>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === questions.length - 1;
    const progress = (currentQuestionIndex / questions.length) * 100;
    const isAnswered = answeredQuestions.has(currentQuestionIndex);

    const handleAnswerSelect = (option: string) => {
        if (answeredQuestions.has(currentQuestionIndex)) return;

        setSelectedAnswer(option);

        const isCorrect = option === currentQuestion.correctSpeaker;
        if (isCorrect) {
            setScore(score + 1);
        }

        setAnsweredQuestions(new Set(answeredQuestions).add(currentQuestionIndex));
    };

    const handleNext = () => {
        if (isLastQuestion) {
            setShowResult(true);
        } else {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedAnswer(null);
        }
    };

    const handleRestart = () => {
        setCurrentQuestionIndex(0);
        setSelectedAnswer(null);
        setScore(0);
        setShowResult(false);
        setAnsweredQuestions(new Set());
        refetch();
    };

    if (showResult) {
        return (
            <PageComponentContainer variant="list">
                <QuizResults
                    score={score}
                    totalQuestions={questions.length}
                    onRestart={handleRestart}
                />
            </PageComponentContainer>
        );
    }

    return (
        <PageComponentContainer variant="list">
            <Container maxWidth="md">
                <QuizHeader
                    currentQuestion={currentQuestionIndex + 1}
                    totalQuestions={questions.length}
                    score={score}
                    progress={progress}
                />

                <QuizQuestion
                    quote={currentQuestion.quote}
                    series={currentQuestion.series}
                    season={currentQuestion.season}
                    episode={currentQuestion.episode}
                />

                <QuizOptions
                    options={currentQuestion.options}
                    selectedAnswer={selectedAnswer}
                    correctAnswer={currentQuestion.correctSpeaker}
                    isAnswered={isAnswered}
                    onAnswerSelect={handleAnswerSelect}
                />

                {isAnswered && (
                    <QuizFeedback
                        isCorrect={selectedAnswer === currentQuestion.correctSpeaker}
                        correctAnswer={currentQuestion.correctSpeaker}
                        isLastQuestion={isLastQuestion}
                        onNext={handleNext}
                    />
                )}
            </Container>
        </PageComponentContainer>
    );
}