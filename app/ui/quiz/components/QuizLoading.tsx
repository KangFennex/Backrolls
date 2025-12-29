import '../../shared/Skeleton.scss';

export default function QuizLoading() {
    return (
        <div className="flex flex-col items-center justify-center min-h-96 gap-4">
            {/* Quiz header skeleton */}
            <div className="sk sk--text-lg" style={{ width: '60%', maxWidth: 300 }} />
            <div className="sk sk--text" style={{ width: '40%', maxWidth: 200 }} />

            {/* Question area skeleton */}
            <div className="mt-8 w-full max-w-2xl space-y-4">
                <div className="sk sk--text-lg" style={{ width: '100%' }} />
                <div className="sk sk--text" style={{ width: '85%' }} />
                <div className="sk sk--text" style={{ width: '70%' }} />
            </div>

            {/* Options skeleton */}
            <div className="mt-8 w-full max-w-2xl space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="sk" style={{ width: '100%', height: 50 }} />
                ))}
            </div>
        </div>
    );
}
