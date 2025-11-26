'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import SubmitHeader from './components/SubmitHeader';
import SubmitContent from './components/SubmitContent';

export function SubmitForm() {

    return (
        <Box sx={{
            backgroundColor: 'var(--grey-slate)',
            minWidth: '300px',
            minHeight: '400px',
            maxWidth: 600,
            margin: '0 auto',
            padding: 2,
            borderRadius: 2,
            border: '1px solid var(--pastel-pink)'
        }}>
            <Card sx={{ backgroundColor: 'transparent', boxShadow: 'none', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <SubmitHeader />
                <SubmitContent />
            </Card>
        </Box>
    );
}