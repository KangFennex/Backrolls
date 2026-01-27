'use client';

import { useState } from 'react';
import { PageSectionHeader } from '../shared/PageSectionHeader';
import { CommunityFeed } from './components/CommunityFeed';
import { CommunitySidebar } from './components/CommunitySidebar';
import { CreatePostModal } from './components/CreatePostModal';
import '@/app/scss/pages/tea-room/TeaRoomPageClient.scss';

export default function TeaRoomPageClient() {
    const [selectedCommunity, setSelectedCommunity] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<'hot' | 'new' | 'top'>('hot');
    const [showCreatePost, setShowCreatePost] = useState(false);
    const [showSidebarMobile, setShowSidebarMobile] = useState(false);

    const Tab = ({ title, active, value }: { title: string; active: boolean; value: 'hot' | 'new' | 'top' }) => (
        <button
            className={`tea-room__tab ${active ? 'tea-room__tab--active' : ''}`}
            onClick={setSortBy.bind(null, value)}
        >
            {title}
        </button>
    );

    return (
        <section className="tea-room">
            <PageSectionHeader
                title="The Tea Room"
            />

            <div className="tea-room__container">

                {/* Mobile sidebar overlay */}
                {showSidebarMobile && (
                    <div
                        className="tea-room__sidebar-overlay"
                        onClick={() => setShowSidebarMobile(false)}
                    />
                )}

                {/* Main content */}
                <div className="tea-room__main">
                    <div className="tea-room__header">
                        {/* Mobile sidebar toggle */}
                        <button
                            className="tea-room__sidebar-toggle"
                            onClick={() => setShowSidebarMobile(!showSidebarMobile)}
                        >
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </button>

                        <div className="tea-room__tabs">

                            <Tab
                                title="New"
                                value="new"
                                active={sortBy === 'new'}
                            />
                            <Tab
                                title="Hot"
                                value="hot"
                                active={sortBy === 'hot'}
                            />
                            <Tab
                                title="Top"
                                value="top"
                                active={sortBy === 'top'}
                            />
                        </div>

                        <div className="tea-room__actions">
                            <button
                                className="tea-room__create-btn"
                                onClick={() => setShowCreatePost(true)}
                            >
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                    <path d="M8 2a.5.5 0 01.5.5v5h5a.5.5 0 010 1h-5v5a.5.5 0 01-1 0v-5h-5a.5.5 0 010-1h5v-5A.5.5 0 018 2z" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <CommunityFeed
                        communityId={selectedCommunity}
                        sortBy={sortBy}
                    />
                </div>

                {/* Sidebar - desktop always visible, mobile controlled */}
                <div className={`tea-room__sidebar ${showSidebarMobile ? 'tea-room__sidebar--mobile-visible' : ''}`}>
                    <CommunitySidebar
                        onSelectCommunity={(id) => {
                            setSelectedCommunity(id);
                            setShowSidebarMobile(false);
                        }}
                        selectedCommunity={selectedCommunity}
                    />
                </div>
            </div>

            {/* Create Post Modal */}
            {showCreatePost && (
                <CreatePostModal
                    onClose={() => setShowCreatePost(false)}
                    communityId={selectedCommunity}
                />
            )}
        </section>
    );
}
