import type { Metadata } from 'next';
import { Cutive_Mono, VT323 } from 'next/font/google';
import Script from 'next/script';
import './globals.css';

// VT323 drives the CRT-terminal look; Cutive Mono is a graceful fallback.
const vt323 = VT323({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-terminal',
  display: 'swap',
});

const cutiveMono = Cutive_Mono({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'optional',
});

// Cloudflare Web Analytics - optional, only enabled if token is provided
const cloudflareToken = process.env.NEXT_PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN;

export const metadata: Metadata = {
  title: 'Phasmophobia Ghostbook',
  description: 'An online journal for your Phasmophobia investigations.',
  icons: {
    icon: '/favicon.ico',
    apple: '/logo192.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${vt323.variable} ${cutiveMono.variable}`}>
        <div id="root">{children}</div>
        {cloudflareToken && (
          <Script
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon={`{"token": "${cloudflareToken}"}`}
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
