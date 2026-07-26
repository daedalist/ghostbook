import type { Metadata } from 'next';
import { Silkscreen, Source_Code_Pro, Cutive_Mono } from 'next/font/google';
import Script from 'next/script';
import './globals.css';

// Silkscreen drives the CRT look; Source Code Pro is used in high-legibility
// mode; Cutive Mono is a graceful fallback. Each exposes a CSS variable that
// globals.css wires into --font-terminal.
const silkscreen = Silkscreen({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-silkscreen',
  display: 'swap',
});
const sourceCodePro = Source_Code_Pro({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-source-code-pro',
  display: 'swap',
});
const cutiveMono = Cutive_Mono({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-cutive',
  display: 'swap',
});

const fontVariables = `${silkscreen.variable} ${sourceCodePro.variable} ${cutiveMono.variable}`;

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
    <html lang="en" className={fontVariables}>
      <body>
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
