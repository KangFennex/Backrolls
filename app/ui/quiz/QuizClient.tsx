'use client';

import { useState } from 'react';
import { Container } from '@mui/material';
import { useQuizQuotes } from '../../lib/hooks/useQuizQuotes';
import PageComponentContainer from '../shared/pageComponentContainer';
import {
    QuizHeader,
    QuizQuestion,
    QuizOptions,
    QuizFeedback,
    QuizResults,
    QuizLead,
    QuizLoading,
    QuizError,
    QuizEmpty
} from './components';

interface UserAnswer {
    questionIndex: number;
    selectedAnswer: string;
    correctAnswer: string;
    quote: string;
    isCorrect: boolean;
}

export default function QuizClient() {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [score, setScore] = useState(0);
    const [displayLead, setDisplayLead] = useState(true);
    const [showResult, setShowResult] = useState(false);
    const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set());
    const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const { data: questions, isLoading, error, refetch } = useQuizQuotes(10);

    if (isLoading) {
        return (
            <PageComponentContainer title="Backroll Quiz">
                <QuizLoading />
            </PageComponentContainer>
        );
    }

    if (error) {
        return (
            <PageComponentContainer title="Backroll Quiz">
                <QuizError message={error.message} onRetry={() => refetch()} />
            </PageComponentContainer>
        );
    }

    if (!questions || questions.length === 0) {
        return (
            <PageComponentContainer title="Backroll Quiz">
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

        // Store the answer for results page
        setUserAnswers([...userAnswers, {
            questionIndex: currentQuestionIndex,
            selectedAnswer: option,
            correctAnswer: currentQuestion.correctSpeaker,
            quote: currentQuestion.quote,
            isCorrect
        }]);

        setAnsweredQuestions(new Set(answeredQuestions).add(currentQuestionIndex));
    };

    const handleNext = () => {
        if (isLastQuestion) {
            setShowResult(true);
        } else {
            // Start transition
            setIsTransitioning(true);

            // Wait for fade out, then change question
            setTimeout(() => {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
                setSelectedAnswer(null);

                // Fade back in
                setTimeout(() => {
                    setIsTransitioning(false);
                }, 50);
            }, 300);
        }
    };

    const handleRestart = () => {
        setCurrentQuestionIndex(0);
        setSelectedAnswer(null);
        setScore(0);
        setShowResult(false);
        setAnsweredQuestions(new Set());
        setUserAnswers([]);
        setIsTransitioning(false);
        refetch();
    };

    const handleLeadToggle = () => {
        setDisplayLead(!displayLead);
    };

    if (displayLead) {
        return (
            <PageComponentContainer title="Backroll Quiz">
                <QuizLead onStartQuiz={handleLeadToggle} />
            </PageComponentContainer>
        );
    }

    if (showResult) {
        return (
            <PageComponentContainer title="Backroll Quiz">
                <QuizResults
                    score={score}
                    totalQuestions={questions.length}
                    userAnswers={userAnswers}
                    onRestart={handleRestart}
                />
            </PageComponentContainer>
        );
    }

    return (
        <PageComponentContainer title="Backroll Quiz">
            <Container
                maxWidth="md"
                className={`transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
            >
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
                        isLastQuestion={isLastQuestion}
                        onNext={handleNext}
                    />
                )}
            </Container>
        </PageComponentContainer>
    );
}