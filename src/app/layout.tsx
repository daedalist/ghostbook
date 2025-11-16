import type { Metadata } from 'next';
import { Cutive_Mono } from 'next/font/google';
import Script from 'next/script';
import './globals.css';

const cutiveMono = Cutive_Mono({
  weight: '400',
  subsets: ['latin'],
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
    children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={cutiveMono.className}>
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