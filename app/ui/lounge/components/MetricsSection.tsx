'use client'

import { trpc } from '@/app/lib/trpc';

export default function MetricsSection() {
    const { data: stats, isLoading } = trpc.user.getStats.useQuery();

    if (isLoading) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Activity</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="sk sk--text h-24 rounded-lg" />
                    ))}
                </div>
            </div>
        );
    }

    const metrics = [
        {
            label: 'Quotes Submitted',
            value: stats?.quotesSubmitted || 0,
            icon: '💬',
            color: 'bg-gradient-to-br from-pink-500 to-pink-600',
        },
        {
            label: 'Comments Made',
            value: stats?.commentsCount || 0,
            icon: '💭',
            color: 'bg-gradient-to-br from-purple-500 to-purple-600',
        },
        {
            label: 'Votes Cast',
            value: stats?.votesCount || 0,
            icon: '👍',
            color: 'bg-gradient-to-br from-blue-500 to-blue-600',
        },
    ];

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Activity</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {metrics.map((metric, index) => (
                    <div
                        key={index}
                        className={`${metric.color} text-white rounded-lg p-6 shadow-lg transform transition-all duration-200 hover:scale-105 hover:shadow-xl`}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-4xl">{metric.icon}</span>
                            <span className="text-3xl font-bold">{metric.value}</span>
                        </div>
                        <div className="text-sm font-semibold opacity-90">
                            {metric.label}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
