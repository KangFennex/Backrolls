import { Suspense } from 'react';
import { FilterSelectorsContent } from './FilterSelectorsContent';

export const FilterSelectors = () => {
    return (
        <Suspense fallback={<div className="flex flex-row items-center gap-2 justify-center py-2">Loading filters...</div>}>
            <FilterSelectorsContent />
        </Suspense>
    )
}