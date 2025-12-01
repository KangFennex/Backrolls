import CardContent from '@mui/material/CardContent';
import Collapse from '@mui/material/Collapse';
import { BackrollDetailsProps } from '../../../lib/definitions';

export default function BackrollDetails({ quote, expanded }: BackrollDetailsProps) {
    return (
        <Collapse in={expanded} timeout="auto" unmountOnExit>
            <CardContent sx={{
                padding: '0 5px',
                borderTop: '1px solid rgba(255, 255, 240, 0.1)',
                backgroundColor: 'rgba(255, 255, 255, 0.02)'
            }}>
                <div className='flex flex-col gap-2 pt-4 ml-3'>
                    <div><span className='backrollCard-font text-2xl'>Speaker:</span> {quote.speaker}</div>
                    <div><span className='backrollCard-font text-2xl'>Series:</span> {quote.series}</div>
                    <div><span className='backrollCard-font text-2xl'>Season:</span> {quote.season}</div>
                    <div><span className='backrollCard-font text-2xl'>Episode:</span> {quote.episode}</div>
                    <div><span className='backrollCard-font text-2xl'>Episode Title:</span> {quote.episode_title}</div>
                    <div><span className='backrollCard-font text-2xl'>Type:</span> {quote.type}</div>
                    <div><span className='backrollCard-font text-2xl'>Air Date:</span> {quote.air_date ? (quote.air_date instanceof Date ? quote.air_date.toLocaleDateString() : quote.air_date) : 'N/A'}</div>
                    <div><span className='backrollCard-font text-2xl'>Timestamp:</span> {quote.timestamp}</div>
                    <div><span className='backrollCard-font text-2xl'>Context:</span></div>
                </div>
            </CardContent>
        </Collapse>
    );
}