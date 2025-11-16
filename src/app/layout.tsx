import type { Metadata } from 'next';
import { Cutive_Mono } from 'next/font/google';
import './globals.css';

const cutiveMono = Cutive_Mono({
  weight: '400',
  subsets: ['latin'],
  display: 'optional',
});

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
      </body>
    </html>
  );
}