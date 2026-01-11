'use client'

import Link from 'next/link';
import '@/app/scss/layout/Footer.scss';
import { FaTwitter, FaGithub, FaTelegram, FaTiktok, FaDiscord } from 'react-icons/fa';
import { BackrollsLogo } from '../shared/BackrollsLogo';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                {/* Logo and Description Section */}
                <div className="footer-section footer-logo-section">
                    <div className="flex items-center">
                        <BackrollsLogo />
                        <span className="beta-badge">beta</span>
                    </div>
                    <p className="footer-description">
                        Your ultimate destination for memorable quotes from your favorite shows.
                        Browse, submit, and celebrate the most iconic moments with fellow fans.
                    </p>
                </div>

                {/* Quick Links Section */}
                <div className="footer-section">
                    <h3 className="footer-heading">Quick Links</h3>
                    <ul className="footer-links">
                        <li><Link href="/tea-room">Tea Room</Link></li>
                        <li><Link href="/lounge">Lounge</Link></li>
                        <li><Link href="/submit">Submit Backroll</Link></li>
                        <li><Link href="/about">About</Link></li>
                    </ul>
                </div>

                {/* Contact & Legal Section */}
                <div className="footer-section">
                    <h3 className="footer-heading">Contact & Legal</h3>
                    <div className="footer-contact-info">
                        <p>
                            <span className="contact-label">General inquiries:</span><br />
                            <a href="mailto:contact@backrolls.com">contact@backrolls.com</a>
                        </p>
                        <p>
                            <span className="contact-label">DMCA & Legal:</span><br />
                            <a href="mailto:legal@backrolls.com">legal@backrolls.com</a>
                        </p>
                        <Link href="/policies" style={{ color: 'rgba(255, 182, 193, 0.8)', marginTop: '0.5rem', display: 'inline-block' }}>
                            View Policies
                        </Link>
                    </div>
                </div>

                {/* Follow Us Section */}
                <div className="footer-section">
                    <h3 className="footer-heading">Follow Us</h3>
                    <div className="footer-social-icons">
                        <div className="social-icon" aria-label="Twitter">
                            <FaTwitter size={20} />
                        </div>
                        <div className="social-icon" aria-label="GitHub">
                            <FaGithub size={20} />
                        </div>
                        <div className="social-icon" aria-label="Telegram">
                            <FaTelegram size={20} />
                        </div>
                        <div className="social-icon" aria-label="TikTok">
                            <FaTiktok size={20} />
                        </div>
                        <div className="social-icon" aria-label="Discord">
                            <FaDiscord size={20} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Copyright Section */}
            <div className="footer-bottom">
                <p>&copy; 2024-2025 Backrolls. All rights reserved.</p>
                <ul className="footer-bottom-links">
                    <li><Link href="/about">About Us</Link></li>
                    <li><Link href="/policies">Privacy Policy</Link></li>
                    <li><Link href="/policies">Terms of Service</Link></li>
                    <li><Link href="/policies">DMCA Policy</Link></li>
                </ul>
            </div>
        </footer>
    );
}
