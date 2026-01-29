// Update your existing BackrollDetailClient.tsx
'use client'

import { useNavigationContext } from '../../context/NavigationContext';
import PageComponentContainer from '../pageComponentContainer';
import { useQuoteById, useQuotesBySpeaker } from '../../lib/hooks';
import BackrollCommentsContainer from './components/BackrollCommentsContainer';
import Breadcrumb from '../breadcrumbs';
import { getSpeakerImageWithFallback } from '../../lib/utils';
import { BackrollCardMinimal } from '../backrollCards/BackrollCardMinimal';
import '@/app/scss/backrolls/BackrollDetailClient.scss';
import { QuoteActionButtons } from '../shared/ActionButtons';
import { FaEye } from "react-icons/fa";
import { BackrollStats } from './components/BackrollStats';

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
                <div className="w-full flex flex-col gap-4">
                    <div className="sk sk--image" style={{ width: '100%', borderRadius: 12 }} />
                    <div className="sk sk--text-lg" style={{ width: '70%' }} />
                    <div className="sk sk--text-lg" style={{ width: '55%' }} />
                    <div className="sk sk--text" style={{ width: 100 }} />
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
        <>
            <div className="backroll-detail-layout">

                {/* Main Section - Breadcrumb, Quote, and Details */}
                <div className="backroll-detail-main">

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

                    {/* Quote Text */}
                    <div className="backroll-detail-quote">
                        <p className="quote-text backrollCard-font">{quote.quote_text}</p>
                        <p className="quote-speaker">— {quote.speaker}</p>
                    </div>


                    {/* Contestant Image */}
                    <div
                        className="backroll-detail-image"
                        style={{ backgroundImage: `url(${speakerImage})` }}
                    />

                    {/* Action Buttons */}
                    <div className="backroll-detail-stats">
                        <QuoteActionButtons
                            quoteId={backrollId}
                            quoteText={quote.quote_text}
                            initialVoteCount={quote.vote_count}
                        />
                        {/*                         
                        <div className="stat-item">
                            <FaEye className="stat-icon" />
                            <span>313K</span>
                        </div> */}
                    </div>

                    {/* Middle Content - Stats */}
                    <BackrollStats quote={quote} />

                </div>

                {/* Horizontal Scrollable Section - Similar Quotes */}
                <div className="backroll-detail-horizontal-section">
                    <h3 className="horizontal-section-title">More from {quote.speaker}</h3>
                    <div className="horizontal-quotes-container">
                        {speakerQuotes && speakerQuotes.length > 0 ? (
                            speakerQuotes.map((speakerQuote) => (
                                <div key={speakerQuote.id} className="horizontal-quote-item">
                                    <BackrollCardMinimal
                                        quote={speakerQuote}
                                        onClick={() => navigateToBackroll(speakerQuote)}
                                    />
                                </div>
                            ))
                        ) : (
                            <p className="no-quotes-message">No other quotes from this speaker</p>
                        )}
                    </div>
                </div>

                {/* Comments Section */}
                <BackrollCommentsContainer quoteId={backrollId} />
            </div>
        </>
    );
}