// Update your existing BackrollDetailClient.tsx
'use client'

import { useNavigationContext } from '../../context/NavigationContext';
import PageComponentContainer from '../shared/pageComponentContainer';
import { useQuoteById, useQuotesBySpeaker } from '../../lib/hooks';
import { useAuth } from '../../lib/hooks';
import BackrollCommentsContainer from './components/BackrollCommentsContainer';
import Breadcrumb from '../shared/breadcrumbs';
import { getSpeakerImageWithFallback } from '../../lib/utils';
import { BackrollCardMinimal } from '../backrollCards/BackrollCardMinimal';
import '@/app/scss/backrolls/BackrollDetailClient.scss';
import { QuoteActionButtons } from '../shared/ActionButtons';
import { FaEye } from "react-icons/fa";
import { BackrollStats } from './components/BackrollStats';
import { useState, useRef, useEffect } from 'react';
import BackrollDropdownMenu from './components/BackrollDropdownMenu';
import { BsThreeDots } from 'react-icons/bs';

interface BackrollDetailClientProps {
    backrollId: string;
}

export default function BackrollDetailClient({ backrollId }: BackrollDetailClientProps) {
    const { navigateToBackroll } = useNavigationContext();
    const { user } = useAuth();
    const { data: quote, isLoading, error } = useQuoteById(backrollId);
    const { data: speakerQuotes } = useQuotesBySpeaker(
        quote?.speaker || '',
        backrollId,
        8
    );

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
    const menuButtonRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const isOwner = user?.id === quote?.user_id;

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node) &&
                menuButtonRef.current &&
                !menuButtonRef.current.contains(event.target as Node)
            ) {
                setIsMenuOpen(false);
            }
        };

        if (isMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMenuOpen]);

    // Close menu when scrolling
    useEffect(() => {
        const handleScroll = () => {
            if (isMenuOpen) {
                setIsMenuOpen(false);
            }
        };

        if (isMenuOpen) {
            window.addEventListener('scroll', handleScroll, true);
        }

        return () => {
            window.removeEventListener('scroll', handleScroll, true);
        };
    }, [isMenuOpen]);

    const handleMenuToggle = (e: React.MouseEvent) => {
        e.stopPropagation();

        if (!isMenuOpen && menuButtonRef.current) {
            const rect = menuButtonRef.current.getBoundingClientRect();
            setMenuPosition({
                top: window.scrollY + rect.bottom + 4,
                left: window.scrollX + rect.right - 140,
            });
        }

        setIsMenuOpen(!isMenuOpen);
    };

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();

        if (!confirm('Are you sure you want to delete this quote? This action cannot be undone.')) {
            return;
        }

        setIsMenuOpen(false);
        setIsDeleting(true);

        try {
            // TODO: Implement delete quote mutation
            console.log('Delete quote:', backrollId);
            // await deleteQuoteMutation.mutateAsync({ quoteId: backrollId });
        } catch (error) {
            console.error('Error deleting quote:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleMenuAction = (action: string, e: React.MouseEvent) => {
        e.stopPropagation();
        console.log(`${action} quote:`, backrollId);
        setIsMenuOpen(false);
    };

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        console.log('Edit quote:', backrollId);
        setIsMenuOpen(false);
        // Add edit logic here if needed
    };

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

                    {/* Breadcrumb with Menu */}
                    <div className="backroll-detail-breadcrumb" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Breadcrumb
                            region={quote.region}
                            seriesCode={quote.series_code}
                            series={quote.series}
                            season={quote.season}
                            episode={quote.episode}
                        />
                        <div
                            ref={menuButtonRef}
                            onClick={handleMenuToggle}
                            style={{
                                cursor: 'pointer',
                                padding: '0.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'rgba(255, 255, 240, 0.6)',
                                transition: 'color 0.3s ease, background-color 0.3s ease',
                                borderRadius: '50%',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.color = '#EE5BAC';
                                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.color = 'rgba(255, 255, 240, 0.6)';
                                e.currentTarget.style.backgroundColor = 'transparent';
                            }}
                        >
                            <BsThreeDots size={20} />
                        </div>
                        {isMenuOpen && (
                            <BackrollDropdownMenu
                                menuRef={menuRef}
                                menuPosition={menuPosition}
                                isOwner={isOwner}
                                isDeleting={isDeleting}
                                onSave={(e) => handleMenuAction('Save', e)}
                                onHide={(e) => handleMenuAction('Hide', e)}
                                onReport={(e) => handleMenuAction('Report', e)}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        )}
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