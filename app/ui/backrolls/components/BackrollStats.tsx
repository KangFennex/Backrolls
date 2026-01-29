import type { Quote } from '@/app/lib/definitions'

export const BackrollStats = ({ quote }: { quote: Quote }) => {
    return (
        <div className="backroll-detail-content">
            {/* Details */}
            <div className="backroll-detail-info">
                <div className="info-row">
                    <span className="info-label">Series:</span>
                    <span className="info-value">{quote.series}</span>
                </div>
                <div className="info-row">
                    <span className="info-label">Season:</span>
                    <span className="info-value">{quote.season}</span>
                </div>
                <div className="info-row">
                    <span className="info-label">Episode:</span>
                    <span className="info-value">{quote.episode}</span>
                </div>
                <div className="info-row">
                    <span className="info-label">Episode Title:</span>
                    <span className="info-value">{quote.episode_title || `S${quote.season}E${quote.episode}`}</span>
                </div>
                <div className="info-row">
                    <span className="info-label">Timestamp:</span>
                    <span className="info-value">{quote.timestamp}</span>
                </div>
                <div className="info-row">
                    <span className="info-label">Air Date:</span>
                    <span className="info-value">{quote.air_date}</span>
                </div>
                {quote.original_language !== 'english' && quote.original_language_text && (
                    <div className="info-row">
                        <span className="info-label">Original:</span>
                        <span className="info-value">{quote.original_language_text}</span>
                    </div>
                )}
            </div>
        </div>
    )
}