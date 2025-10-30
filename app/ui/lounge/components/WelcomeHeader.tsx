interface WelcomeHeaderProps {
    username?: string;
}

export default function WelcomeHeader({ username }: WelcomeHeaderProps) {
    return (
        <div className="text-center mb-6 py-4">
            <h1 className="text-3xl md:text-4xl font-light text-gray-700 mb-2">
                Welcome to your Lounge
            </h1>
            <p className="text-sm md:text-lg text-gray-500">
                {username || 'Guest'}
            </p>
        </div>
    );
}