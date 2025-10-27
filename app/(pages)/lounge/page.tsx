'use client'

import Lounge from '../../ui/lounge/lounge';
import PageContainer from '../../ui/pageContainer';

export default function LoungePage() {
    return (
        <PageContainer>
            <div className="flex flex-col items-center pt-3">
                <Lounge />
            </div>
        </PageContainer>
    )
}