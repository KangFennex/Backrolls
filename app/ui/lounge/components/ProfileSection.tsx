'use client'

import { useState } from 'react';
import { trpc } from '@/app/lib/trpc';
import '@/app/scss/pages/lounge/Lounge.scss';

interface ProfileSectionProps {
    user: { username: string; email: string; id: string };
}

export default function ProfileSection({ user }: ProfileSectionProps) {
    const [isEditingUsername, setIsEditingUsername] = useState(false);
    const [isEditingPassword, setIsEditingPassword] = useState(false);
    const [username, setUsername] = useState(user.username);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const updateUsernameMutation = trpc.user.updateUsername.useMutation();
    const updatePasswordMutation = trpc.user.updatePassword.useMutation();

    const handleUpdateUsername = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            await updateUsernameMutation.mutateAsync({ username });
            setSuccess('Username updated successfully!');
            setIsEditingUsername(false);
            // Refresh the page to update the session
            setTimeout(() => window.location.reload(), 1500);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update username');
        }
    };

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (newPassword !== confirmPassword) {
            setError('New passwords do not match');
            return;
        }

        if (newPassword.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        try {
            await updatePasswordMutation.mutateAsync({
                currentPassword,
                newPassword
            });
            setSuccess('Password updated successfully!');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setIsEditingPassword(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update password');
        }
    };

    return (
        <div className="profile-section">
            <h2 className="profile-section__title">Profile Settings</h2>

            {/* Success/Error Messages */}
            {success && (
                <div className="profile-section__message profile-section__message--success">
                    {success}
                </div>
            )}
            {error && (
                <div className="profile-section__message profile-section__message--error">
                    {error}
                </div>
            )}

            {/* Username */}
            <div className="profile-section__field">
                <label className="profile-section__label">
                    Username
                </label>
                {!isEditingUsername ? (
                    <div className="profile-section__input-wrapper">
                        <input
                            type="text"
                            value={user.username}
                            disabled
                            className="profile-section__input"
                        />
                        <button
                            onClick={() => setIsEditingUsername(true)}
                            className="profile-section__button profile-section__button--edit"
                        >
                            Edit
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleUpdateUsername} className="space-y-2">
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="profile-section__input"
                            minLength={3}
                            maxLength={100}
                        />
                        <div className="profile-section__form-actions">
                            <button
                                type="submit"
                                disabled={updateUsernameMutation.isPending}
                                className="profile-section__button profile-section__button--success"
                            >
                                {updateUsernameMutation.isPending ? 'Saving...' : 'Save'}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsEditingUsername(false);
                                    setUsername(user.username);
                                }}
                                className="profile-section__button profile-section__button--secondary"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                )}
            </div>

            {/* Email (Read-only, display only) */}
            <div className="profile-section__field">
                <label className="profile-section__label">
                    Email
                </label>
                <input
                    type="email"
                    value={user.email}
                    disabled
                    className="profile-section__input"
                />
            </div>

            {/* Password */}
            <div className="profile-section__field">
                <label className="profile-section__label">
                    Password
                </label>
                {!isEditingPassword ? (
                    <div className="profile-section__input-wrapper">
                        <input
                            type="password"
                            value="••••••••"
                            disabled
                            className="profile-section__input"
                        />
                        <button
                            onClick={() => setIsEditingPassword(true)}
                            className="profile-section__button profile-section__button--edit"
                        >
                            Edit
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleUpdatePassword} className="space-y-3">
                        <input
                            type="password"
                            placeholder="Current password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="profile-section__input"
                            required
                        />
                        <input
                            type="password"
                            placeholder="New password (min 8 characters)"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="profile-section__input"
                            minLength={8}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="profile-section__input"
                            minLength={8}
                            required
                        />
                        <div className="profile-section__form-actions">
                            <button
                                type="submit"
                                disabled={updatePasswordMutation.isPending}
                                className="profile-section__button profile-section__button--success"
                            >
                                {updatePasswordMutation.isPending ? 'Updating...' : 'Update Password'}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsEditingPassword(false);
                                    setCurrentPassword('');
                                    setNewPassword('');
                                    setConfirmPassword('');
                                }}
                                className="profile-section__button profile-section__button--secondary"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
