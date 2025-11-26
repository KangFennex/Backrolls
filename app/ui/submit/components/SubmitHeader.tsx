'use client';

import CardHeader from '@mui/material/CardHeader';

export default function SubmitHeader() {
    const backroll = <p>backroll</p>;

    return (
        <CardHeader
            title={
                <div className="flex items-center justify-center gap-2 text-sm md:text-lg lg:text-xl">
                    <span><p className='backrollCard-font'>Look, a new</p></span>
                    <span className="logo pink-fill lg:text-3xl">{backroll}</span>
                </div>
            }
            sx={{
                backgroundColor: 'transparent',
                width: '100%',
                textAlign: 'center',
                paddingBottom: 2,
                padding: 0,
                color: 'var(--antique-parchment)'
            }}
        />
    );
}