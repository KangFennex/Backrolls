export default function ActivityCard() {
    return (
        <div className="bg-gradient-to-br from-cyan-200 to-pink-200 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 min-h-[200px]">
            <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                    📊 Activity
                </h3>
                <p className="text-gray-500 text-sm">
                    Coming soon...
                </p>
            </div>
        </div>
    );
}