'use client'

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../lib/hooks';
import { useRouter } from 'next/navigation';
import PageComponentContainer from '../pageComponentContainer';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import FavoritesTab from './components/FavoritesTab';
import SubmittedTab from './components/SubmittedTab';
import CommentedTab from './components/CommentedTab';
import { useFavorites, useSubmittedQuotes, useCommentedQuotes } from '../../lib/hooks';
import LoungeHeader from './components/LoungeHeader';

type TabType = 'favorites' | 'submitted' | 'commented';

export default function LoungePageClient() {
    const { user, isLoading: authLoading, isAuthenticated } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabType>('favorites');
    const { data: favoritesData, isLoading: favoritesLoading } = useFavorites();
    const { data: submittedData, isLoading: submittedLoading } = useSubmittedQuotes();
    const { data: commentedData, isLoading: commentedLoading } = useCommentedQuotes();
    const nodeRef = useRef(null);

    const renderTabContent = (tab: TabType) => {
        switch (tab) {
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
        return <div className="text-center text-gray-600">Loading...</div>;
    }

    return (
        <PageComponentContainer>
            <div className="w-full max-w-6xl mx-auto px-4 py-8">
                {/* Header */}
                <LoungeHeader
                    user={user}
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