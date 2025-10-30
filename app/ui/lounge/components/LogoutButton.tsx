interface LogoutButtonProps {
    onLogout: () => void;
}

export default function LogoutButton({ onLogout }: LogoutButtonProps) {
    return (
        <button
            onClick={onLogout}
            className="w-full bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white py-3 px-6 rounded-lg font-medium transition-colors duration-200"
        >
            Sign Out
        </button>
    );
}