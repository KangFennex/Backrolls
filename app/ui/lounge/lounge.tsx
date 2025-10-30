'use client'

import { useState, useEffect } from 'react';
import { useAuth } from '../../lib/hooks';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
    WelcomeHeader,
    FavoritesCard,
    SubmissionsCard,
    ActivityCard,
    ProfileCard,
    ProfileDetailsCard,
    LogoutButton
} from './components';

export default function Lounge() {
    const { user, isLoading, isAuthenticated } = useAuth();
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        username: user?.username || '',
        catchPhrase: '',
        zodiacSign: '',
        FavSeason: '',
        FavQueen: '',
        aboutMe: '',
        links: '',
        numbers: ''
    });

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isLoading, isAuthenticated, router]);

    const handleLogout = async () => {
        try {
            // Use NextAuth signOut
            await signOut({ callbackUrl: '/' });
        } catch (error) {
            console.error('Logout failed:', error);
            // Fallback: redirect to login
            router.push('/login');
        }
    };

    if (isLoading) {
        return <div className="text-center text-gray-600">Loading...</div>;
    }

    const handleInputChange = (field: string, value: string) => {
        setProfileData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = () => {
        // TODO: Implement save functionality
        setIsEditing(false);
    };

    const handleCancel = () => {
        // TODO: Reset form data if needed
        setIsEditing(false);
    };

    return (
        <div className="min-h-screen w-full max-w-full">
            <WelcomeHeader username={user?.username} />

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-6 max-w-7xl mx-auto px-4 w-full min-w-0">

                {/* Left Column - Content Boxes */}
                <div className="flex flex-col gap-4 order-2 md:order-1 min-w-0 w-full">
                    <FavoritesCard />

                    {/* Secondary Content Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <SubmissionsCard />
                        <ActivityCard />
                    </div>
                </div>

                {/* Right Column - Profile Sidebar */}
                <div className="flex flex-col gap-4 order-1 md:order-2">
                    <ProfileCard 
                        user={user} 
                        onEditToggle={() => setIsEditing(!isEditing)} 
                    />
                    
                    <ProfileDetailsCard
                        profileData={profileData}
                        isEditing={isEditing}
                        onEditToggle={() => setIsEditing(!isEditing)}
                        onInputChange={handleInputChange}
                        onSave={handleSave}
                        onCancel={handleCancel}
                    />

                    <LogoutButton onLogout={handleLogout} />
                </div>
            </div>
        </div>
    );
}