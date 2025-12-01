'use client'

type TabType = 'favorites' | 'submitted' | 'commented';

interface LoungeHeaderProps {
    user: { username?: string | null } | null | undefined;
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
}

export default function LoungeHeader({ user, activeTab, onTabChange }: LoungeHeaderProps) {
    return (
        <div className="mb-8">
            <h1 className="text-4xl font-bold text-left mb-6 text-pink-500">{`${user?.username}, let's kiki!`}</h1>

            {/* Tab Buttons */}
            <div className="flex justify-baseline gap-4">
                <button
                    className={`px-6 py-3 rounded-lg font-semibold transition-all ${activeTab === 'favorites'
                        ? 'bg-pink-500 text-white shadow-lg'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    onClick={() => onTabChange('favorites')}
                >
                    Favorites
                </button>
                <button
                    className={`px-6 py-3 rounded-lg font-semibold transition-all ${activeTab === 'submitted'
                        ? 'bg-pink-500 text-white shadow-lg'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    onClick={() => onTabChange('submitted')}
                >
                    Submitted
                </button>
                <button
                    className={`px-6 py-3 rounded-lg font-semibold transition-all ${activeTab === 'commented'
                        ? 'bg-pink-500 text-white shadow-lg'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    onClick={() => onTabChange('commented')}
                >
                    Commented
                </button>
            </div>
        </div>
    );
}