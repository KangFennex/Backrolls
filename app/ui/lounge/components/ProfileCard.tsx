import { ExtendedUser } from '../../../lib/definitions';

interface ProfileCardProps {
    user?: ExtendedUser | null;
    onEditToggle: () => void;
}

export default function ProfileCard({ user, onEditToggle }: ProfileCardProps) {
    return (
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
            <div className="p-6 text-center">
                <div className="relative inline-block mb-4">
                    <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                        {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <button className="absolute -bottom-1 -right-1 bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-full w-8 h-8 flex items-center justify-center transition-colors duration-200">
                        📷
                    </button>
                </div>

                <h2 className="text-lg font-semibold text-gray-700 mb-1">
                    {user?.username || 'Guest'}
                </h2>

                <p className="text-sm text-gray-500 mb-4">
                    {user?.email || 'No email'}
                </p>

                <button
                    onClick={onEditToggle}
                    className="px-4 py-2 border-2 border-blue-500 text-blue-500 hover:bg-blue-50 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 mx-auto"
                >
                    ✏️ Edit Profile
                </button>
            </div>
        </div>
    );
}