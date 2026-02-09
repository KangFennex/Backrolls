'use client'

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../lib/hooks';
import { useRouter } from 'next/navigation';
import PageComponentContainer from '../shared/pageComponentContainer';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import FavoritesTab from './components/FavoritesTab';
import SubmittedTab from './components/SubmittedTab';
import CommentedTab from './components/CommentedTab';
import ProfileSection from './components/ProfileSection';
import MetricsSection from './components/MetricsSection';
import { useFavorites, useSubmittedQuotes, useCommentedQuotes } from '../../lib/hooks';
import LoungeHeader from './components/LoungeHeader';
import '@/app/scss/components/Skeleton.scss';
import '@/app/scss/pages/lounge/Lounge.scss';

type TabType = 'profile' | 'favorites' | 'submitted' | 'commented';

export default function LoungePageClient() {
    const { user, isLoading: authLoading, isAuthenticated } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabType>('profile');
    const { data: favoritesData, isLoading: favoritesLoading } = useFavorites();
    const { data: submittedData, isLoading: submittedLoading } = useSubmittedQuotes();
    const { data: commentedData, isLoading: commentedLoading } = useCommentedQuotes();
    const nodeRef = useRef(null);

    const renderTabContent = (tab: TabType) => {
        switch (tab) {
            case 'profile':
                return (
                    <div className="space-y-6">
                        <MetricsSection />
                        {user && user.email && user.username && user.id && (
                            <ProfileSection
                                user={{
                                    email: user.email,
                                    username: user.username,
                                    id: user.id
                                }}
                            />
                        )}
                    </div>
                );
            case 'favorites':
                return <FavoritesTab data={favoritesData?.quotes || []} isLoading={favoritesLoading} />;
            case 'submitted':
                return <SubmittedTab data={submittedData?.quotes || []} isLoading={submittedLoading} />;
            case 'commented':
                return <CommentedTab data={commentedData?.comments || []} isLoading={commentedLoading} />;
            default:
                return null;
        }
    };

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [authLoading, isAuthenticated, router]);

    if (authLoading) {
        return (
            <div className="flex flex-col gap-4 w-full">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="sk sk--text" style={{ width: `${50 + i * 10}%`, height: 20 }} />
                ))}
            </div>
        );
    }

    return (
        <PageComponentContainer>
            <div className="lounge-container">
                {/* Header */}
                <LoungeHeader
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                />

                {/* Tab Content */}
                <SwitchTransition mode="out-in">
                    <CSSTransition
                        key={activeTab}
                        nodeRef={nodeRef}
                        timeout={300}
                        classNames="fade"
                        unmountOnExit
                    >
                        <div ref={nodeRef} className="w-full min-h-[400px]">
                            {renderTabContent(activeTab)}
                        </div>
                    </CSSTransition>
                </SwitchTransition>
            </div>

            {/* CSS for transitions */}
            <style jsx global>{`
                .fade-enter {
                    opacity: 0;
                    transform: translateX(10px);
                }
                .fade-enter-active {
                    opacity: 1;
                    transform: translateY(0);
                    transition: opacity 300ms, transform 300ms;
                }
                .fade-exit {
                    opacity: 1;
                    transform: translateX(0);
                }
                .fade-exit-active {
                    opacity: 0;
                    transform: translateX(-10px);
                    transition: opacity 300ms, transform 300ms;
                }
            `}</style>
        </PageComponentContainer>
    );
}