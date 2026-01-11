'use client'

import { useState } from 'react';
import { trpc } from '@/app/lib/trpc';

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
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Profile Settings</h2>
            
            {/* Success/Error Messages */}
            {success && (
                <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
                    {success}
                </div>
            )}
            {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                    {error}
                </div>
            )}

            {/* Email (Read-only) */}
            <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-600 mb-2">
                    Email
                </label>
                <div className="flex items-center gap-2">
                    <input
                        type="email"
                        value={user.email}
                        disabled
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                    />
                    <span className="text-xs text-gray-500">Cannot be changed</span>
                </div>
            </div>

            {/* Username */}
            <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-600 mb-2">
                    Username
                </label>
                {!isEditingUsername ? (
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={user.username}
                            disabled
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                        />
                        <button
                            onClick={() => setIsEditingUsername(true)}
                            className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors font-semibold"
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
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                            minLength={3}
                            maxLength={100}
                        />
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                disabled={updateUsernameMutation.isPending}
                                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold disabled:opacity-50"
                            >
                                {updateUsernameMutation.isPending ? 'Saving...' : 'Save'}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsEditingUsername(false);
                                    setUsername(user.username);
                                }}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-semibold"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                )}
            </div>

            {/* Password */}
            <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-600 mb-2">
                    Password
                </label>
                {!isEditingPassword ? (
                    <div className="flex items-center gap-2">
                        <input
                            type="password"
                            value="••••••••"
                            disabled
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                        />
                        <button
                            onClick={() => setIsEditingPassword(true)}
                            className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors font-semibold"
                        >
                            Change
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleUpdatePassword} className="space-y-3">
                        <input
                            type="password"
                            placeholder="Current password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                            required
                        />
                        <input
                            type="password"
                            placeholder="New password (min 8 characters)"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                            minLength={8}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                            minLength={8}
                            required
                        />
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                disabled={updatePasswordMutation.isPending}
                                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold disabled:opacity-50"
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
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-semibold"
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
