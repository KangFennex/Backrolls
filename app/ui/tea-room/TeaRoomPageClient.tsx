'use client';

import './TeaRoomPageClient.scss';
import { PageSectionHeader } from "../shared/PageSectionHeader";

export default function TeaRoomPageClient() {
    return (
        <section className="tea-room">
            {/* Hero */}
            <PageSectionHeader
                badge="Under Construction"
                title="The Tea Room"
                subtitle="Brewed thoughts, spicy takes, and long sips. Blog-like cards are coming soon."
            />

            {/* Placeholder blog cards */}
            <div className="tea-room__grid">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div className="tea-room__card" key={i}>
                        <div className="tea-room__card-media skeleton skeleton--image" />
                        <div className="tea-room__card-body">
                            <div className="skeleton skeleton--text skeleton--text-lg" />
                            <div className="skeleton skeleton--text" />
                            <div className="skeleton skeleton--text skeleton--short" />
                        </div>
                    </div>
                ))}
            </div>

            <div className="tea-room__cta">
                <p className="tea-room__cta-text">
                    Want a ping when the first pour drops?
                </p>
                <button className="tea-room__cta-button" disabled>
                    Notifications coming soon
                </button>
            </div>
        </section>
    );
}