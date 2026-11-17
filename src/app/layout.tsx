import type { Metadata } from 'next'
import { Barlow, Barlow_Condensed } from 'next/font/google'
import './globals.css'

const barlow = Barlow({
  variable: '--font-barlow',
  subsets: ['latin'],
  weight: ['400', '600', '700'],
})

const barlowCondensed = Barlow_Condensed({
  variable: '--font-barlow-condensed',
  subsets: ['latin'],
  weight: ['600', '700', '800'],
})

export const metadata: Metadata = {
  title: 'Transi',
  description:
    'A native iOS and Android app for Bratislava public transport: live departure boards, a trip planner that follows your trip step by step, full timetables and a map of every stop.',
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
  // icons: app/icon.svg (the flat mark) and app/favicon.ico (the same mark, for browsers without SVG icons)
  openGraph: {
    title: 'Transi',
    description:
      'Live departures, a trip planner that follows your trip, timetables and a map for MHD Bratislava.',
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

// Runs before first paint, so the page never renders one way and then jumps. It has to be a plain inline
// <script> in <head>: next/script's beforeInteractive only runs once Next's own runtime has loaded, which
// is after the first paint.
//
//   data-platform  which platform's button is filled and first, and which phone the hero shows
//                  (the same rule as lib/useDevicePlatform.ts)
//   .non-apple     custom scrollbar, skipped on Apple devices
//   .intro         start states of the load animations; without script nothing is ever hidden
//   .still         the background network holds still: Save-Data, a cellular or 2G/3G connection, or at most
//                  4 CPU threads or 4 GB of memory (the connection and memory are only known in Chromium)
const BEFORE_PAINT = `(function(d,n){var apple=/iPhone|iPad|iPod|Macintosh/i.test(n.userAgent),c=n.connection;d.dataset.platform=apple?'ios':'android';if(!apple)d.classList.add('non-apple');if(!matchMedia('(prefers-reduced-motion: reduce)').matches)d.classList.add('intro');if(c&&(c.saveData||c.type==='cellular'||/2g|3g/.test(c.effectiveType))||n.hardwareConcurrency<=4||n.deviceMemory<=4)d.classList.add('still')})(document.documentElement,navigator)`

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    // suppressHydrationWarning: the script above adds an attribute and classes to <html> before React hydrates
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: BEFORE_PAINT }} />
      </head>
      <body className={`${barlow.variable} ${barlowCondensed.variable}`}>
        <a href="#main-content" className="skip">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  )
}
