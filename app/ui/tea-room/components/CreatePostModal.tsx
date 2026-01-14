'use client';

import { useState } from 'react';
import { trpc } from '@/app/lib/trpc';

interface CreatePostModalProps {
    onClose: () => void;
    communityId?: string | null;
}

export function CreatePostModal({ onClose, communityId }: CreatePostModalProps) {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [postType, setPostType] = useState<'text' | 'image' | 'link'>('text');
    const [imageUrl, setImageUrl] = useState('');
    const [linkUrl, setLinkUrl] = useState('');
    const [selectedCommunityId, setSelectedCommunityId] = useState(communityId || '');
    const [isNsfw, setIsNsfw] = useState(false);
    const [isSpoiler, setIsSpoiler] = useState(false);
    const [error, setError] = useState('');

    const utils = trpc.useUtils();
    const { data: communities } = trpc.community.listCommunities.useQuery();
    const createPost = trpc.post.createPost.useMutation({
        onSuccess: () => {
            utils.feed.getPopularFeed.invalidate();
            utils.feed.getHomeFeed.invalidate();
            utils.community.getCommunityPosts.invalidate();
            resetForm();
            onClose();
        },
        onError: (err) => {
            setError(err.message);
        }
    });

    const resetForm = () => {
        setTitle('');
        setBody('');
        setPostType('text');
        setImageUrl('');
        setLinkUrl('');
        setSelectedCommunityId(communityId || '');
        setIsNsfw(false);
        setIsSpoiler(false);
        setError('');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!title.trim()) {
            setError('Title is required');
            return;
        }

        if (title.length > 300) {
            setError('Title must be 300 characters or less');
            return;
        }

        if (!selectedCommunityId) {
            setError('Please select a community');
            return;
        }

        if (postType === 'text' && !body.trim()) {
            setError('Post body is required for text posts');
            return;
        }

        if (postType === 'image' && !imageUrl.trim()) {
            setError('Image URL is required for image posts');
            return;
        }

        if (postType === 'link' && !linkUrl.trim()) {
            setError('Link URL is required for link posts');
            return;
        }

        createPost.mutate({
            communityId: selectedCommunityId,
            title: title.trim(),
            body: body.trim() || undefined,
            postType,
            imageUrl: postType === 'image' ? imageUrl.trim() : undefined,
            linkUrl: postType === 'link' ? linkUrl.trim() : undefined,
            isNsfw,
            isSpoiler,
        });
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content modal-content--create-post" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Create a Post</h2>
                    <button className="modal-close" onClick={onClose} aria-label="Close">
                        &times;
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="create-post-form">
                    {error && (
                        <div className="form-error">{error}</div>
                    )}

                    {!communityId && (
                        <div className="form-group">
                            <label htmlFor="community">Community *</label>
                            <select
                                id="community"
                                value={selectedCommunityId}
                                onChange={(e) => setSelectedCommunityId(e.target.value)}
                                required
                            >
                                <option value="">Select a community</option>
                                {communities?.map((community) => (
                                    <option key={community.id} value={community.id}>
                                        {community.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="form-group">
                        <label>Post Type</label>
                        <div className="post-type-selector">
                            <button
                                type="button"
                                className={`post-type-btn ${postType === 'text' ? 'post-type-btn--active' : ''}`}
                                onClick={() => setPostType('text')}
                            >
                                Text
                            </button>
                            <button
                                type="button"
                                className={`post-type-btn ${postType === 'image' ? 'post-type-btn--active' : ''}`}
                                onClick={() => setPostType('image')}
                            >
                                Image
                            </button>
                            <button
                                type="button"
                                className={`post-type-btn ${postType === 'link' ? 'post-type-btn--active' : ''}`}
                                onClick={() => setPostType('link')}
                            >
                                Link
                            </button>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="title">Title *</label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            maxLength={300}
                            required
                            placeholder="An interesting title..."
                        />
                        <span className="char-count">{title.length}/300</span>
                    </div>

                    {postType === 'text' && (
                        <div className="form-group">
                            <label htmlFor="body">Body *</label>
                            <textarea
                                id="body"
                                value={body}
                                onChange={(e) => setBody(e.target.value)}
                                rows={8}
                                required
                                placeholder="What's on your mind?"
                            />
                        </div>
                    )}

                    {postType === 'image' && (
                        <div className="form-group">
                            <label htmlFor="imageUrl">Image URL *</label>
                            <input
                                type="url"
                                id="imageUrl"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                                required
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>
                    )}

                    {postType === 'link' && (
                        <div className="form-group">
                            <label htmlFor="linkUrl">Link URL *</label>
                            <input
                                type="url"
                                id="linkUrl"
                                value={linkUrl}
                                onChange={(e) => setLinkUrl(e.target.value)}
                                required
                                placeholder="https://example.com"
                            />
                        </div>
                    )}

                    <div className="form-group form-group--checkboxes">
                        <label>
                            <input
                                type="checkbox"
                                checked={isNsfw}
                                onChange={(e) => setIsNsfw(e.target.checked)}
                            />
                            <span>NSFW (Not Safe For Work)</span>
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                checked={isSpoiler}
                                onChange={(e) => setIsSpoiler(e.target.checked)}
                            />
                            <span>Spoiler</span>
                        </label>
                    </div>

                    <div className="modal-actions">
                        <button
                            type="button"
                            className="btn btn--secondary"
                            onClick={onClose}
                            disabled={createPost.isPending}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn--primary"
                            disabled={createPost.isPending}
                        >
                            {createPost.isPending ? 'Posting...' : 'Post'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
