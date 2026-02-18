'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { IoClose } from 'react-icons/io5';
import { MdReportGmailerrorred } from 'react-icons/md';

interface ReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    quoteId: string;
    quoteText: string;
}

const REPORT_REASONS = [
    'Inappropriate content',
    'Offensive language',
    'Spam or misleading',
    'Incorrect attribution',
    'Duplicate quote',
    'Other',
];

export default function ReportModal({ isOpen, onClose, quoteId, quoteText }: ReportModalProps) {
    const [selectedReason, setSelectedReason] = useState('');
    const [additionalText, setAdditionalText] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsAnimating(true);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
            // Reset state when modal closes
            setTimeout(() => {
                setIsSubmitted(false);
                setSelectedReason('');
                setAdditionalText('');
                setIsAnimating(false);
            }, 300);
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedReason) {
            alert('Please select a reason for reporting');
            return;
        }

        // TODO: Add backend API call here with quoteId, selectedReason, and additionalText
        console.log('Report submitted:', { quoteId, selectedReason, additionalText });
        setIsSubmitted(true);
    };

    const handleClose = () => {
        setIsAnimating(false);
        setTimeout(() => {
            onClose();
        }, 300);
    };

    if (!isOpen && !isAnimating) return null;
    if (typeof window === 'undefined') return null;

    return createPortal(
        <div
            className="fixed inset-0 z-[10000] flex items-center justify-center"
            style={{
                animation: isOpen ? 'fadeIn 0.3s ease-out' : 'fadeOut 0.3s ease-out',
            }}
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={handleClose}
                style={{
                    animation: isOpen ? 'fadeIn 0.3s ease-out' : 'fadeOut 0.3s ease-out',
                }}
            />

            {/* Modal */}
            <div
                className="relative w-full max-w-lg mx-4 bg-[rgba(30,30,40,0.95)] backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden"
                style={{
                    animation: isOpen ? 'slideUp 0.3s ease-out' : 'slideDown 0.3s ease-out',
                    maxHeight: '90vh',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {!isSubmitted ? (
                    <>
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-white/10">
                            <div className="flex items-center gap-3">
                                <MdReportGmailerrorred className="text-pink-500" size={24} />
                                <h2 className="text-xl font-semibold text-white" style={{ fontFamily: 'Google Sans, sans-serif' }}>
                                    Report Quote
                                </h2>
                            </div>
                            <button
                                onClick={handleClose}
                                className="p-2 rounded-full transition-all duration-200 hover:bg-white/10"
                                aria-label="Close modal"
                            >
                                <IoClose className="text-white/60 hover:text-white" size={24} />
                            </button>
                        </div>

                        {/* Content */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 180px)' }}>
                            {/* Quote Display */}
                            <div>
                                <label className="block text-sm font-medium text-white/80 mb-2" style={{ fontFamily: 'Google Sans, sans-serif' }}>
                                    Quote
                                </label>
                                <textarea
                                    value={quoteText}
                                    readOnly
                                    className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white/90 resize-none focus:outline-none"
                                    style={{ fontFamily: 'Google Sans, sans-serif' }}
                                    rows={3}
                                />
                            </div>

                            {/* Report Reason Dropdown */}
                            <div>
                                <label htmlFor="report-reason" className="block text-sm font-medium text-white/80 mb-2" style={{ fontFamily: 'Google Sans, sans-serif' }}>
                                    Reason for reporting <span className="text-pink-500">*</span>
                                </label>
                                <select
                                    id="report-reason"
                                    value={selectedReason}
                                    onChange={(e) => setSelectedReason(e.target.value)}
                                    className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white/90 focus:outline-none focus:border-pink-500/50 transition-colors cursor-pointer"
                                    style={{ fontFamily: 'Google Sans, sans-serif' }}
                                    required
                                >
                                    <option value="" disabled>Select a reason</option>
                                    {REPORT_REASONS.map((reason) => (
                                        <option key={reason} value={reason} className="bg-[#1e1e28]">
                                            {reason}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Additional Details */}
                            <div>
                                <label htmlFor="additional-text" className="block text-sm font-medium text-white/80 mb-2" style={{ fontFamily: 'Google Sans, sans-serif' }}>
                                    Additional details <span className="text-white/40">(optional)</span>
                                </label>
                                <textarea
                                    id="additional-text"
                                    value={additionalText}
                                    onChange={(e) => setAdditionalText(e.target.value)}
                                    placeholder="Provide any additional information..."
                                    className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white/90 resize-none focus:outline-none focus:border-pink-500/50 transition-colors placeholder:text-white/30"
                                    style={{ fontFamily: 'Google Sans, sans-serif' }}
                                    rows={4}
                                    maxLength={500}
                                />
                                <div className="text-xs text-white/40 mt-1 text-right" style={{ fontFamily: 'Google Sans, sans-serif' }}>
                                    {additionalText.length}/500
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="flex-1 px-6 py-3 bg-white/5 border border-white/10 rounded-lg text-white/80 font-medium transition-all duration-200 hover:bg-white/10 hover:text-white active:scale-95"
                                    style={{ fontFamily: 'Google Sans, sans-serif' }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-3 bg-pink-500 rounded-lg text-white font-medium transition-all duration-200 hover:bg-pink-600 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                    style={{ fontFamily: 'Google Sans, sans-serif' }}
                                    disabled={!selectedReason}
                                >
                                    Submit Report
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    /* Success Message */
                    <div className="p-8 text-center">
                        <div className="mb-4 flex justify-center">
                            <div className="p-4 bg-green-500/20 rounded-full">
                                <MdReportGmailerrorred className="text-green-500" size={48} />
                            </div>
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-3" style={{ fontFamily: 'Google Sans, sans-serif' }}>
                            Report Submitted
                        </h3>
                        <p className="text-white/70 mb-6" style={{ fontFamily: 'Google Sans, sans-serif' }}>
                            Thank you for your report. Our team will review it and take appropriate action if necessary.
                        </p>
                        <button
                            onClick={handleClose}
                            className="px-8 py-3 bg-pink-500 rounded-lg text-white font-medium transition-all duration-200 hover:bg-pink-600 active:scale-95"
                            style={{ fontFamily: 'Google Sans, sans-serif' }}
                        >
                            Close
                        </button>
                    </div>
                )}
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                @keyframes fadeOut {
                    from {
                        opacity: 1;
                    }
                    to {
                        opacity: 0;
                    }
                }

                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px) scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }

                @keyframes slideDown {
                    from {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                    to {
                        opacity: 0;
                        transform: translateY(20px) scale(0.95);
                    }
                }
            `}</style>
        </div>,
        document.body
    );
}
