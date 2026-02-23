import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Transi',
  description:
    'Native iOS & Android app for public transport in Bratislava. Real-time departures, trip planner and timetables for public transport in Bratislava.',
  keywords: [
    'MHD Bratislava',
    'public transport',
    'virtual table',
    'trip planner',
    'timetable',
    'Slovak transit',
    'Bratislava',
    'idsbk',
    'imhd',
    'virtualna tabula',
  ],
  authors: [{ name: 'magic_sk' }],
  icons: {
    icon: [
      { url: '/favicon.ico', media: '(prefers-color-scheme: light)' },
      { url: '/favicon-dark.ico', media: '(prefers-color-scheme: dark)' },
    ],
  },
  openGraph: {
    title: 'Transi',
    description:
      'Real-time departures, trip planner & timetables for MHD Bratislava.',
    type: 'website',
    images: [
      {
        url: '/logo/transi-iOS-Default-1024x1024@1x.png',
        width: 1024,
        height: 1024,
        alt: 'Transi App Icon',
      },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Runs before paint - adds 'non-apple' class so custom scrollbar is skipped on Apple devices */}
        <Script
          id="non-apple-scrollbar"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `if(!/iPhone|iPad|iPod|Macintosh/i.test(navigator.userAgent))document.documentElement.classList.add('non-apple')`,
          }}
        />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[999] focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-medium focus:text-white focus:shadow-lg"
          style={{ background: '#f13953' }}
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  )
}
