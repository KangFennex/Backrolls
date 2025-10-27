import "./logo.scss";
import Link from 'next/link';

export default function Logo() {
    return (
        <Link 
        href="/"
        className="logo text-5xl md:text-[2.5rem] flex items-center justify-center h-full">
            <span className="block md:hidden mt-2">B.</span>
            <span className="hidden md:block">Backrolls</span>
        </Link>
    );
};