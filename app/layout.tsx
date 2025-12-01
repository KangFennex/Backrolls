import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "./ui/ClientLayout";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Backrolls",
  description: "A repository of queer quotes",
  icons: {
    icon: "/favicon.ico",
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased overflow-x-hidden">
        <Providers>
          <ClientLayout>{children}</ClientLayout>
        </Providers>
      </body>
    </html>
  );
}