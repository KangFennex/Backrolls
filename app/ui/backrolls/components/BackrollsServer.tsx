'use client';

import { useBackrollsStore } from '../../../store/backrollsStore';
import BackrollsClient from './BackrollsClient';

export default function BackrollsPageServer() {
    const displayResults = useBackrollsStore((state) => state.displayResults);
    
    // Debug logging
    console.log('BackrollsPageServer - displayResults:', displayResults);
    console.log('BackrollsPageServer - displayResults length:', displayResults?.length);

    return (
        <BackrollsClient displayResults={displayResults} />
    );
}