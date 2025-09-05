import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Phasmophobia Ghostbook',
  description: 'An online journal for your Phasmophobia investigations.',
  icons: {
    icon: '/favicon.ico',
    apple: '/logo192.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css?family=Cutive+Mono" rel="stylesheet" />
      </head>
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  )
}