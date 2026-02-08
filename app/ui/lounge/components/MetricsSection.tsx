'use client'

import { trpc } from '@/app/lib/trpc';
import '@/app/scss/pages/lounge/Lounge.scss';

export default function MetricsSection() {
    const { data: stats, isLoading } = trpc.user.getStats.useQuery();

    if (isLoading) {
        return (
            <div className="metrics-section">
                <h2 className="metrics-section__title">Your Activity</h2>
                <div className="metrics-section__grid">
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
            colorClass: 'metrics-section__card--pink',
        },
        {
            label: 'Comments Made',
            value: stats?.commentsCount || 0,
            icon: '💭',
            colorClass: 'metrics-section__card--lavender',
        },
        {
            label: 'Votes Cast',
            value: stats?.votesCount || 0,
            icon: '👍',
            colorClass: 'metrics-section__card--mint',
        },
    ];

    return (
        <div className="metrics-section">
            <h2 className="metrics-section__title">Your Activity</h2>
            <div className="metrics-section__grid">
                {metrics.map((metric, index) => (
                    <div
                        key={index}
                        className={`metrics-section__card ${metric.colorClass}`}
                    >
                        <div className="metrics-section__card-content">
                            <span className="metrics-section__icon">{metric.icon}</span>
                            <span className="metrics-section__value">{metric.value}</span>
                        </div>
                        <div className="metrics-section__label">
                            {metric.label}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
