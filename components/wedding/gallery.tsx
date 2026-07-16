// components/wedding/gallery.tsx
'use client'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { wedding } from '@/lib/wedding-config'
import { fadeUp, staggerContainer, viewportDefaults } from '@/lib/motion'
import { ErrorBoundary } from './error-boundary'

const OrbitGallery = dynamic(
  () => import('./orbit-gallery').then((m) => m.OrbitGallery),
  { ssr: false }
)

const fallbackImages = [
  '/images/gallery-1.webp',
  '/images/gallery-2.webp',
  '/images/gallery-3.webp',
  '/images/gallery-4.webp',
  '/images/gallery-5.webp',
  '/images/gallery-6.webp',
  '/images/gallery-7.webp',
  '/images/gallery-8.webp',
]

export function Gallery() {
  const galleryImages = [...wedding.gallery]
  while (galleryImages.length < 8) {
    galleryImages.push(fallbackImages[galleryImages.length])
  }
  const images = galleryImages.slice(0, 8)

  return (
    <section className="relative px-6 py-24 safe-x md:py-32">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={viewportDefaults}
        className="mb-8 text-center md:mb-10"
      >
        <motion.p
          variants={fadeUp}
          className="font-poppins font-medium text-fluid-xs uppercase tracking-[0.35em] text-gold/80"
        >
          
        </motion.p>
        <motion.h2
          variants={fadeUp}
          className="mt-4 py-2 font-geographica leading-[1.3] text-gradient-gold text-[clamp(2.5rem,5vw,5rem)] md:mt-6"
        >
          The days that lead us here
        </motion.h2>
        <motion.p
          variants={fadeUp}
          className="mx-auto mt-4 max-w-md font-poppins font-light text-fluid-xs italic text-cream/55"
        >
          Captured before our wedding day.
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={viewportDefaults}
        transition={{ duration: 1 }}
        className="relative mx-auto h-[70vh] max-h-[760px] w-full max-w-[1500px] min-h-[460px] overflow-visible"
      >
        <ErrorBoundary
          fallback={
            <div className="grid h-full w-full grid-cols-2 gap-3 sm:grid-cols-4">
              {images.map((src, i) => (
                <div
                  key={i}
                  role="img"
                  aria-label={'Wedding moment ' + (i + 1)}
                  style={{ backgroundImage: 'url(' + src + ')' }}
                  className="rounded-xl border border-gold/15 bg-cover bg-center"
                />
              ))}
            </div>
          }
        >
          <OrbitGallery images={images} />
        </ErrorBoundary>
      </motion.div>
    </section>
  )
}
