'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import { BackrollsLogo } from '../sharedComponents';

export function SubmitForm() {
    const backroll = <span className='logo pink-fill'><p>Backroll</p></span>;

    return (
        <Box sx={{
            backgroundColor: 'var(--rich-charcoal)',
            minWidth: '300px',
            minHeight: '400px',
            maxWidth: 600,
            margin: '0 auto',
            padding: 2,
            borderRadius: 2,
            border: '1px solid var(--pastel-pink)'
        }}>
            <Card sx={{ backgroundColor: 'transparent', boxShadow: 'none', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <CardHeader
                    title={
                        <span className="flex items-center justify-center gap-2">
                            Submit a {backroll}
                        </span>
                    }
                    sx={{ backgroundColor: 'transparent', width: '100%', textAlign: 'center', paddingBottom: 2, color: 'var(--antique-parchment)' }}
                />
                <CardContent sx={{ backgroundColor: 'transparent' }}>
                    {/* Form fields go here */}
                </CardContent>
            </Card>
        </Box>
    );
}