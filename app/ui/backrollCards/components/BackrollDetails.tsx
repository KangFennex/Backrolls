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
                <div className='flex flex-col gap-2 pt-4 text-sm warm-ivory'>
                    <div><span>Speaker:</span> {quote.speaker}</div>
                    <div><span>Series:</span> {quote.series}</div>
                    <div><span>Season:</span> {quote.season}</div>
                    <div><span>Episode:</span> {quote.episode}</div>
                    <div><span>Timestamp:</span> {quote.timestamp}</div>
                    <div><span>Context:</span> {quote.context}</div>
                </div>
            </CardContent>
        </Collapse>
    );
}