'use client'

import Link from 'next/link';
import '@/app/scss/layout/Footer.scss';
import { FaTwitter, FaGithub, FaTelegram, FaTiktok, FaDiscord } from 'react-icons/fa';
import { BackrollsLogo } from '../shared/BackrollsLogo';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-container">
                {/* Left Section - Logo & Tagline */}
                <div className="footer-brand">
                    <div className="footer-logo-wrapper">
                        <BackrollsLogo />
                        <span className="beta-badge">beta</span>
                    </div>
                    <p className="footer-tagline">Memorable quotes from your favorite show</p>
                </div>

                {/* Center Section - Navigation */}
                <nav className="footer-nav">
                    <div className="footer-nav-group">
                        <Link href="/tea-room">Tea Room</Link>
                        <Link href="/lounge">Lounge</Link>
                        <Link href="/submit">Submit</Link>
                        <Link href="/about">About</Link>
                    </div>
                    <div className="footer-nav-divider"></div>
                    <div className="footer-nav-group footer-nav-group--secondary">
                        <Link href="/policies">Policies</Link>
                        <a href="mailto:contact@backrolls.com">Contact</a>
                        <a href="mailto:legal@backrolls.com">Legal</a>
                    </div>
                </nav>

                {/* Right Section - Social & Copyright */}
                <div className="footer-meta">
                    <div className="footer-social">
                        <a href="#" className="social-link" aria-label="Twitter">
                            <FaTwitter size={18} />
                        </a>
                        <a href="#" className="social-link" aria-label="GitHub">
                            <FaGithub size={18} />
                        </a>
                        <a href="#" className="social-link" aria-label="TikTok">
                            <FaTiktok size={18} />
                        </a>
                        <a href="#" className="social-link" aria-label="Discord">
                            <FaDiscord size={18} />
                        </a>
                    </div>
                    <p className="footer-copyright">&copy; 2026-2027 Backrolls</p>
                </div>
            </div>
        </footer>
    );
}
