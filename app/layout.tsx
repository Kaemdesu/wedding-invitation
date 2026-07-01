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

// ✨ Kepler Std — for framing text (captions, "The Wedding of", date)
const kepler = localFont({
  variable: '--font-kepler',
  display: 'swap',
  src: [
    { path: '../public/fonts/KeplerStd-BoldScnDisp.otf', weight: '700', style: 'normal' },
    { path: '../public/fonts/KeplerStd-BoldScnItDisp.otf', weight: '700', style: 'italic' },
  ],
})

// ✨ Geographica Script — for names
const geographica = localFont({
  variable: '--font-geographica',
  display: 'swap',
  src: [
    { path: '../public/fonts/Geographica-Script.otf', weight: '400', style: 'normal' },
  ],
})

// ✨ Aldhabi — for Arabic text (Bismillah + Ar-Rum 21)
const aldhabi = localFont({
  variable: '--font-aldhabi',
  display: 'swap',
  src: [
    { path: '../public/fonts/aldhabi.ttf', weight: '400', style: 'normal' },
  ],
})

export const metadata: Metadata = {
  title: 'Kelvin & Annisa — A Love Forged in Time',
  description:
    'Kelvin Muliawan & Annisa Fajri Luthfiani are getting married — 8 August 2026, Masjid Izzatul Islam, Grand Wisata Bekasi. Join us in celebrating two souls, one beautiful journey.',
  generator: 'v0.app',
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
      className={`${playfair.variable} ${cormorant.variable} ${geistMono.variable} ${kepler.variable} ${geographica.variable} ${aldhabi.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}