'use client';

import { FiLogIn, FiLogOut } from "react-icons/fi";
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../lib/hooks';

interface PanelAuthButtonProps {
    onClose: () => void;
}

export function PanelAuthButton({ onClose }: PanelAuthButtonProps) {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        await signOut({ redirect: false });
        onClose();
        router.push('/');
        router.refresh();
    };

    const handleLogin = () => {
        onClose();
        router.push('/login');
    };

    if (isLoading) return null;

    return (
        <div className="side-panel__auth">
            {isAuthenticated ? (
                <button
                    onClick={handleLogout}
                    className="side-panel__auth-btn side-panel__auth-btn--logout"
                >
                    <FiLogOut />
                    <span>Logout</span>
                </button>
            ) : (
                <button
                    onClick={handleLogin}
                    className="side-panel__auth-btn side-panel__auth-btn--login"
                >
                    <FiLogIn />
                    <span>Login</span>
                </button>
            )}
        </div>
    );
}
