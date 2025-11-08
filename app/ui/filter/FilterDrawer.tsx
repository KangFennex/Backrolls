'use client'

import { Suspense } from 'react';
import { FilterDrawerContent } from './FilterDrawerContent';
import { FilterDrawerProps } from '../../lib/definitions';

export default function FilterDrawer({ open, onClose }: FilterDrawerProps) {
    return (
        <Suspense fallback={<div>Loading filter drawer...</div>}>
            <FilterDrawerContent open={open} onClose={onClose} />
        </Suspense>
    );
}