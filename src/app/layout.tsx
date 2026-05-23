import type { Metadata } from 'next';
import { Outfit, Inter } from 'next/font/google';
import { ThemeProvider } from '@/context/ThemeContext';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['300', '400', '500', '600', '700', '800'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['300', '400', '500', '600', '700'],
});

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'StreetRise — Transparent Micro-Entrepreneur Rehabilitation Platform',
  description:
    'StreetRise is a transparency-first platform rehabilitating roadside individuals into dignified, self-sustaining micro-entrepreneurs. Every rupee tracked on a public ledger.',
  keywords: [
    'StreetRise',
    'Rehabilitation',
    'Transparency',
    'Social Impact',
    'Street vendors',
    'India',
    'Bengaluru',
  ],
  authors: [{ name: 'Manikandan Kolangi — StreetRise Initiative' }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${inter.variable} h-full scroll-smooth`}
      suppressHydrationWarning
    >
      <head>
        {/* Inline theme script to prevent FOUC */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark')
                } else {
                  document.documentElement.classList.remove('dark')
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="font-sans bg-background text-foreground transition-colors duration-200">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
