import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Cormorant_Garamond, Geist_Mono } from 'next/font/google'
import localFont from 'next/font/local'
import './globals.css'

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  variable: '--font-cormorant',
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const kepler = localFont({
  variable: '--font-kepler',
  display: 'swap',
  src: [
    { path: '../public/fonts/KeplerStd-BoldScnDisp.otf', weight: '700', style: 'normal' },
    { path: '../public/fonts/KeplerStd-BoldScnItDisp.otf', weight: '700', style: 'italic' },
  ],
})

const geographica = localFont({
  variable: '--font-geographica',
  display: 'swap',
  src: [
    { path: '../public/fonts/Geographica-Script.otf', weight: '400', style: 'normal' },
  ],
})

const aldhabi = localFont({
  variable: '--font-aldhabi',
  display: 'swap',
  src: [
    { path: '../public/fonts/aldhabi.ttf', weight: '400', style: 'normal' },
  ],
})

const poppins = localFont({
  variable: '--font-poppins',
  display: 'swap',
  src: [
    { path: '../public/fonts/poppins/Poppins-Light.ttf', weight: '300', style: 'normal' },
    { path: '../public/fonts/poppins/Poppins-Regular.ttf', weight: '400', style: 'normal' },
    { path: '../public/fonts/poppins/Poppins-Medium.ttf', weight: '500', style: 'normal' },
    { path: '../public/fonts/poppins/Poppins-SemiBold.ttf', weight: '600', style: 'normal' },
    { path: '../public/fonts/poppins/Poppins-Bold.ttf', weight: '700', style: 'normal' },
  ],
})

const siteUrl = 'https://annisafajri.kelvinmuliawan.site'
const siteTitle = 'Kelvin & Annisa — Preserved Chapter'
const siteDescription =
  'Kelvin & Annisa are getting married — 8 August 2026, Masjid Izzatul Islam, Grand Wisata Bekasi. Join us in celebrating our special day.'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteTitle,
  description: siteDescription,
  generator: 'v0.app',
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: siteUrl,
    siteName: 'Kelvin & Annisa',
    type: 'website',
    locale: 'id_ID',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Kelvin & Annisa Wedding Invitation',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteTitle,
    description: siteDescription,
    images: ['/og-image.jpg'],
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#0a0a0f',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${cormorant.variable} ${geistMono.variable} ${kepler.variable} ${geographica.variable} ${aldhabi.variable} ${poppins.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}