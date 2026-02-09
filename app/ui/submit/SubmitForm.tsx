'use client';

import SubmitHeader from './components/SubmitHeader';
import SubmitContent from './components/SubmitContent';
import '@/app/scss/pages/submit/Submit.scss';

export function SubmitForm() {
    return (
        <div className="submit-container">
            <div className="submit-form">
                <SubmitHeader />
                <SubmitContent />
            </div>
        </div>
    );
}