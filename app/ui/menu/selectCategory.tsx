'use client';

import { Suspense } from 'react';
import { SelectCategoryContent } from './selectCategoryContent';

export default function SelectCategory() {
    return (
        <Suspense fallback={<div className="text-gray-600">Loading categories...</div>}>
            <SelectCategoryContent />
        </Suspense>
    );
}
