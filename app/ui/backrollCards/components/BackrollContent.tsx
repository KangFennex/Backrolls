import CardContent from '@mui/material/CardContent';
import { BackrollContentProps } from '../../../lib/definitions';

function Backroll({
    quote_text,
    speaker,
    maxLength = 280,
}: {
    quote_text: string;
    speaker: string;
    maxLength?: number;
}) {
    const truncatedText = quote_text.length > maxLength
        ? quote_text.substring(0, maxLength) + '...'
        : quote_text;

    return (
        <div className="backroll">
            <p className="backroll__quote-text backrollCard-font">
                {truncatedText}
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
    maxLength,
    onClick,
}: BackrollContentProps) {
    return (
        <CardContent
            onClick={onClick}
            className="backroll-card-content flex justify-center items-center">
            <Backroll
                quote_text={quoteText}
                speaker={speaker}
                maxLength={maxLength}
            />
        </CardContent>
    );
}