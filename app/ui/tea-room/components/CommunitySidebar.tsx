'use client';

import { trpc } from '@/app/lib/trpc';
import { useState } from 'react';
import Image from 'next/image';
import '@/app/scss/pages/tea-room/CommunitySidebar.scss';

interface CommunitySidebarProps {
    onSelectCommunity: (id: string | null) => void;
    selectedCommunity: string | null;
}

export function CommunitySidebar({ onSelectCommunity, selectedCommunity }: CommunitySidebarProps) {
    const [showCreateCommunity, setShowCreateCommunity] = useState(false);

    const { data: trending } = trpc.feed.getTrendingCommunities.useQuery({ limit: 10 });
    const { data: myCommunities } = trpc.community.listCommunities.useQuery({ limit: 20 });

    return (
        <div className="community-sidebar">

            {/* Create Community */}
            <button
                className="community-sidebar__create"
                onClick={() => setShowCreateCommunity(true)}
            >
                + Create Community
            </button>

            {/* All Posts Button */}
            <div className="community-sidebar__section">
                <button
                    className={`community-sidebar__item ${selectedCommunity === null ? 'community-sidebar__item--active' : ''}`}
                    onClick={() => onSelectCommunity(null)}
                >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 3v14M3 10h14" stroke="currentColor" strokeWidth="2" />
                    </svg>
                    <span>All Posts</span>
                    <span className="community-sidebar__badge">Popular</span>
                </button>
            </div>

            {/* Trending Communities */}
            {trending && trending.length > 0 && (
                <div className="community-sidebar__section">
                    <h3 className="community-sidebar__title">Trending</h3>
                    {trending.map((community) => (
                        <button
                            key={community.id}
                            className={`community-sidebar__item ${selectedCommunity === community.id ? 'community-sidebar__item--active' : ''}`}
                            onClick={() => onSelectCommunity(community.id)}
                        >
                            {community.icon_url ? (
                                <Image
                                    src={community.icon_url}
                                    alt={community.name}
                                    className="community-sidebar__icon"
                                    width={36}
                                    height={36}
                                    unoptimized
                                />
                            ) : (
                                <div className="community-sidebar__icon community-sidebar__icon--placeholder">
                                    {community.name.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <div className="community-sidebar__info">
                                <span className="community-sidebar__name">{community.name}</span>
                                <span className="community-sidebar__meta">
                                    {community.member_count} members
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {/* My Communities */}
            {myCommunities && myCommunities.items.length > 0 && (
                <div className="community-sidebar__section">
                    <h3 className="community-sidebar__title">My Communities</h3>
                    {myCommunities.items.map((community) => (
                        <button
                            key={community.id}
                            className={`community-sidebar__item ${selectedCommunity === community.id ? 'community-sidebar__item--active' : ''}`}
                            onClick={() => onSelectCommunity(community.id)}
                        >
                            {community.icon_url ? (
                                <Image
                                    src={community.icon_url}
                                    alt={community.name}
                                    className="community-sidebar__icon"
                                    width={36}
                                    height={36}
                                    unoptimized
                                />
                            ) : (
                                <div className="community-sidebar__icon community-sidebar__icon--placeholder">
                                    {community.name.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <div className="community-sidebar__info">
                                <span className="community-sidebar__name">{community.name}</span>
                                <span className="community-sidebar__meta">
                                    {community.member_count} members • {community.post_count} posts
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {showCreateCommunity && (
                <CreateCommunityModal onClose={() => setShowCreateCommunity(false)} />
            )}
        </div>
    );
}

// Create Community Modal Component
function CreateCommunityModal({ onClose }: { onClose: () => void }) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [privacy, setPrivacy] = useState<'public' | 'private' | 'restricted'>('public');

    const utils = trpc.useContext();
    const createMutation = trpc.community.createCommunity.useMutation({
        onSuccess: () => {
            utils.community.listCommunities.invalidate();
            utils.feed.getTrendingCommunities.invalidate();
            onClose();
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.length < 4 || description.length < 20) return;

        createMutation.mutate({ name, description, privacy });
    };

    return (
        <div className="community-sidebar__modal-overlay" onClick={onClose}>
            <div className="community-sidebar__modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="community-sidebar__modal-header">
                    <h2>Create a Community</h2>
                    <button onClick={onClose} className="community-sidebar__modal-close">×</button>
                </div>

                <form onSubmit={handleSubmit} className="community-sidebar__modal-form">
                    <div className="community-sidebar__form-group">
                        <label htmlFor="name">Community Name</label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g., Drag Race Discussions"
                            minLength={4}
                            maxLength={100}
                            required
                        />
                        <span className="community-sidebar__form-help">Minimum 4 characters</span>
                    </div>

                    <div className="community-sidebar__form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Tell people what this community is about..."
                            minLength={20}
                            maxLength={10000}
                            rows={4}
                            required
                        />
                        <span className="community-sidebar__form-help">Minimum 20 characters</span>
                    </div>

                    <div className="community-sidebar__form-group">
                        <label>Privacy</label>
                        <div className="community-sidebar__radio-group">
                            <label className="community-sidebar__radio-label">
                                <input
                                    type="radio"
                                    value="public"
                                    checked={privacy === 'public'}
                                    onChange={() => setPrivacy('public')}
                                />
                                <div className="community-sidebar__radio-text">
                                    <strong>Public</strong>
                                    <span>Anyone can view and join</span>
                                </div>
                            </label>
                            <label className="community-sidebar__radio-label">
                                <input
                                    type="radio"
                                    value="restricted"
                                    checked={privacy === 'restricted'}
                                    onChange={() => setPrivacy('restricted')}
                                />
                                <div className="community-sidebar__radio-text">
                                    <strong>Restricted</strong>
                                    <span>Anyone can view, approval needed to post</span>
                                </div>
                            </label>
                            <label className="community-sidebar__radio-label">
                                <input
                                    type="radio"
                                    value="private"
                                    checked={privacy === 'private'}
                                    onChange={() => setPrivacy('private')}
                                />
                                <div className="community-sidebar__radio-text">
                                    <strong>Private</strong>
                                    <span>Invitation only</span>
                                </div>
                            </label>
                        </div>
                    </div>

                    <div className="community-sidebar__modal-actions">
                        <button type="button" onClick={onClose} className="community-sidebar__btn-secondary">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="community-sidebar__btn-primary"
                            disabled={createMutation.isPending || name.length < 4 || description.length < 20}
                        >
                            {createMutation.isPending ? 'Creating...' : 'Create Community'}
                        </button>
                    </div>

                    {createMutation.error && (
                        <div className="community-sidebar__form-error">
                            {createMutation.error.message}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}
