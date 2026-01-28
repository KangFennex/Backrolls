'use client';

import Link from 'next/link';
import { TbHomeSpark } from "react-icons/tb";
import { FaFire, FaRegClock, FaRegQuestionCircle, FaPlus } from "react-icons/fa";
import { FaFire as FaFire6 } from "react-icons/fa6";
import { PiGameControllerBold } from "react-icons/pi";
import { BsCupHot } from "react-icons/bs";
import { RiSofaLine } from "react-icons/ri";

const panelLinks = [
    { label: 'WorkRoom', href: '/', icon: <TbHomeSpark /> },
    { label: 'Hot Backrolls', href: '/hot', icon: <FaFire6 /> },
    { label: 'Fresh Backrolls', href: '/fresh', icon: <FaRegClock /> },
    { label: 'Guess', href: '/guess', icon: <FaRegQuestionCircle /> },
    { label: 'Quiz', href: '/quiz', icon: <PiGameControllerBold /> },
    { label: 'Tea Room', href: '/tea-room', icon: <BsCupHot /> },
    { label: 'Lounge', href: '/lounge', icon: <RiSofaLine /> },
    { label: 'Submit Backroll', href: '/submit', icon: <FaPlus /> },
];

interface PanelLinksProps {
    onClose: () => void;
}

export function PanelLinks({ onClose }: PanelLinksProps) {
    return (
        <div className="side-panel__links">
            <nav className="side-panel__nav">
                {panelLinks.map(({ label, href, icon }) => (
                    <div key={label}>
                        {/* Divider before Lounge */}
                        {label === 'Lounge' && (
                            <div className="side-panel__divider" />
                        )}
                        <Link href={href} onClick={onClose} className="side-panel__link">
                            <div className="side-panel__link-icon">{icon}</div>
                            <span className="side-panel__link-text">{label}</span>
                        </Link>
                    </div>
                ))}
            </nav>
        </div>
    );
}
