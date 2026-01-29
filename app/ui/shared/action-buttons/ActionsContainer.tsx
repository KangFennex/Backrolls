'use client';

import '@/app/scss/components/ActionButtons.scss';
import React from 'react';

// Actions container wrapper
export function ActionsContainer({ children }: { children: React.ReactNode }) {
    return <div className="actions-container">{children}</div>;
}
