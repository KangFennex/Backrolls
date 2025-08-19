import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Search Results",
    description: "Search for quotes from your favorite drag queens",
};

export default function BackrollsLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className="antialiased overflow-x-hidden">
                {children}
            </body>
        </html>
    );
}