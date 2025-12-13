// Update your existing BackrollDetailClient.tsx
'use client'

import { useNavigationContext } from '../../context/NavigationContext';
import PageComponentContainer from '../pageComponentContainer';
import { useQuoteById, useQuotesBySpeaker } from '../../lib/hooks';
import BackrollCommentsContainer from './components/BackrollCommentsContainer';
import Breadcrumb from '../breadcrumbs';
import { getSpeakerImageWithFallback } from '../../lib/utils';
import { BackrollCardSlim } from '../backrollCards/BackrollCardSlim';
import { AiOutlineLike, AiOutlineDislike } from "react-icons/ai";
import { FaComment, FaEye } from "react-icons/fa";
import './BackrollDetailClient.scss';

interface BackrollDetailClientProps {
    backrollId: string;
}

export default function BackrollDetailClient({ backrollId }: BackrollDetailClientProps) {
    const { navigateToBackroll } = useNavigationContext();
    const { data: quote, isLoading, error } = useQuoteById(backrollId);
    const { data: speakerQuotes } = useQuotesBySpeaker(
        quote?.speaker || '',
        backrollId,
        8
    );

    if (isLoading) {
        return (
            <PageComponentContainer>
                <div className="text-center py-8 text-gray-500">
                    Loading...
                </div>
            </PageComponentContainer>
        );
    }

    if (error || !quote) {
        return (
            <PageComponentContainer>
                <div className="text-center py-8 text-red-500">
                    Quote not found
                </div>
            </PageComponentContainer>
        );
    }

    const speakerImage = getSpeakerImageWithFallback(quote.speaker);

    return (
        <PageComponentContainer>
            <div className="backroll-detail-layout">
                {/* Left Column - Main Content */}
                <div className="backroll-detail-main">
                    {/* Contestant Image */}
                    <div
                        className="backroll-detail-image"
                        style={{ backgroundImage: `url(${speakerImage})` }}
                    />

                    {/* Main Content Area */}
                    <div className="backroll-detail-content">
                        {/* Breadcrumb */}
                        <div className="backroll-detail-breadcrumb">
                            <Breadcrumb
                                region={quote.region}
                                seriesCode={quote.series_code}
                                series={quote.series}
                                season={quote.season}
                                episode={quote.episode}
                            />
                        </div>

                        {/* Stats Row */}
                        <div className="backroll-detail-stats">
                            <div className="stat-item">
                                <AiOutlineLike className="stat-icon" />
                                <span>{quote.vote_count}</span>
                            </div>
                            <div className="stat-item">
                                <FaComment className="stat-icon" />
                                <span>{quote.comment_count}</span>
                            </div>
                            <div className="stat-item">
                                <FaEye className="stat-icon" />
                                <span>313K</span>
                            </div>
                        </div>

                        {/* Quote Text */}
                        <div className="backroll-detail-quote">
                            <p className="quote-text">{quote.quote_text}</p>
                            <p className="quote-speaker">— {quote.speaker}</p>
                        </div>

                        {/* Quote Details */}
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

                        {/* Comments Section */}
                        <BackrollCommentsContainer quoteId={backrollId} />
                    </div>
                </div>

                {/* Right Column - Similar Quotes */}
                <div className="backroll-detail-sidebar">
                    <h3 className="sidebar-title">More Backrolls</h3>
                    <div className="sidebar-quotes">
                        {speakerQuotes && speakerQuotes.length > 0 ? (
                            speakerQuotes.map((speakerQuote) => (
                                <BackrollCardSlim
                                    key={speakerQuote.id}
                                    quote={speakerQuote}
                                    onClick={() => navigateToBackroll(speakerQuote)}
                                />
                            ))
                        ) : (
                            <p className="no-quotes-message">No other quotes from this speaker</p>
                        )}
                    </div>
                </div>
            </div>
        </PageComponentContainer>
    );
}