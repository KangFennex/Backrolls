'use client'

import '@/app/scss/pages/lounge/Lounge.scss';

type TabType = 'profile' | 'favorites' | 'submitted' | 'commented';

interface LoungeHeaderProps {
    user: { username?: string | null } | null | undefined;
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
}

export default function LoungeHeader({ user, activeTab, onTabChange }: LoungeHeaderProps) {
    return (
        <div className="lounge-header">
            <div className="lounge-header__tabs">
                <button
                    className={`lounge-header__tab ${activeTab === 'profile' ? 'lounge-header__tab--active' : ''}`}
                    onClick={() => onTabChange('profile')}
                >
                    Profile
                </button>
                <button
                    className={`lounge-header__tab ${activeTab === 'favorites' ? 'lounge-header__tab--active' : ''}`}
                    onClick={() => onTabChange('favorites')}
                >
                    Favorites
                </button>
                <button
                    className={`lounge-header__tab ${activeTab === 'submitted' ? 'lounge-header__tab--active' : ''}`}
                    onClick={() => onTabChange('submitted')}
                >
                    Submitted
                </button>
                <button
                    className={`lounge-header__tab ${activeTab === 'commented' ? 'lounge-header__tab--active' : ''}`}
                    onClick={() => onTabChange('commented')}
                >
                    Commented
                </button>
            </div>
        </div>
    );
}