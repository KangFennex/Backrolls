# Quiz Components

This folder contains all the modular components for the quiz feature, separated by concern.

## Component Structure

### Main Component
- **`QuizClient.tsx`** - Main orchestrator component that manages quiz state and flow

### Sub-components (in `/components`)

#### State Display Components
- **`QuizHeader.tsx`** - Displays question counter, score, and progress bar
- **`QuizQuestion.tsx`** - Displays the quote and series metadata
- **`QuizResults.tsx`** - Final results screen with score and restart option

#### Interactive Components
- **`QuizOptions.tsx`** - Renders answer buttons with correct/incorrect states
- **`QuizFeedback.tsx`** - Shows feedback after answer selection and next button

#### Status Components
- **`QuizLoading.tsx`** - Loading state with spinner
- **`QuizError.tsx`** - Error state with retry button
  - Also exports `QuizEmpty` for no-data state

## Component Props

### QuizHeader
```typescript
{
    currentQuestion: number;    // 1-indexed
    totalQuestions: number;
    score: number;
    progress: number;          // 0-100 percentage
}
```

### QuizQuestion
```typescript
{
    quote: string;
    series: string;
    season: number;
    episode: number;
}
```

### QuizOptions
```typescript
{
    options: string[];         // Array of speaker names
    selectedAnswer: string | null;
    correctAnswer: string;
    isAnswered: boolean;
    onAnswerSelect: (option: string) => void;
}
```

### QuizFeedback
```typescript
{
    isCorrect: boolean;
    correctAnswer: string;
    isLastQuestion: boolean;
    onNext: () => void;
}
```

### QuizResults
```typescript
{
    score: number;
    totalQuestions: number;
    onRestart: () => void;
}
```

### QuizError
```typescript
{
    message: string;
    onRetry: () => void;
}
```

## State Management

Quiz state is managed in `QuizClient`:
- `currentQuestionIndex` - Current question (0-indexed)
- `selectedAnswer` - User's selected answer for current question
- `score` - Total correct answers
- `showResult` - Whether to show final results
- `answeredQuestions` - Set of answered question indices

## Data Flow

1. `useQuizQuotes` hook fetches quiz data from `/api/quiz`
2. `QuizClient` manages state and renders appropriate component
3. User interactions flow up through callbacks
4. State changes trigger re-renders of child components

## Styling

All components use:
- Material-UI components (`Card`, `Button`, `Typography`, etc.)
- Tailwind CSS utility classes for dark theme
- Custom color scheme: Purple/Pink gradients with dark backgrounds
