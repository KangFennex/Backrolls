import CardContent from '@mui/material/CardContent';
import { BackrollContentProps } from '../../../lib/definitions';

function Backroll({
    quote_text,
    speaker,
}: {
    quote_text: string;
    speaker: string;
}) {

    return (
        <div className="backroll">
            <p className="backroll__quote-text backrollCard-font">
                {quote_text}
            </p>
            <span className="backroll__quote-speaker">
                {speaker}
            </span>
        </div>
    );
}

export default function BackrollContent({
    quoteText,
    speaker,
    onClick,
}: BackrollContentProps) {
    return (
        <CardContent
            onClick={onClick}
            sx={{
                flex: 1, // Take up available space
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                padding: '0.1rem !important',
                paddingBottom: '0 !important',
            }}
            className="backroll-card-content">
            <Backroll
                quote_text={quoteText}
                speaker={speaker}
            />
        </CardContent>
    );
}