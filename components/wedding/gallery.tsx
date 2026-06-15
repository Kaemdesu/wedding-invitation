'use client'

import { motion } from 'framer-motion'
import { wedding } from '@/lib/wedding-config'
import { SectionHeading } from './section-heading'
import { Divider } from './divider'

const fallbackImages = [
  '/images/gallery-1.png',
  '/images/gallery-2.png',
  '/images/gallery-3.png',
  '/images/gallery-4.png',
  '/images/gallery-5.png',
  '/images/gallery-6.png',
]

// Fixed no-gap bento layout.
// Desktop layout uses 6 columns and 3 rows:
// - Image 1: large left area
// - Image 2 & 3: stacked right area
// - Image 4, 5, 6: bottom row
const spans = [
  'lg:col-span-4 lg:row-span-2',
  'lg:col-span-2 lg:row-span-1',
  'lg:col-span-2 lg:row-span-1',
  'lg:col-span-2 lg:row-span-1',
  'lg:col-span-2 lg:row-span-1',
  'lg:col-span-2 lg:row-span-1',
]

export function Gallery() {
  const galleryImages = [...wedding.gallery]

  while (galleryImages.length < 6) {
    galleryImages.push(fallbackImages[galleryImages.length])
  }

  const images = galleryImages.slice(0, 6)

  return (
    <section className="relative bg-background px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeading subtitle="Captured Moments" title="Our Gallery" />
        <Divider />

        <div className="mt-12 grid auto-rows-[220px] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6 lg:auto-rows-[180px]">
          {images.map((src, i) => (
            <motion.figure
              key={`${src}-${i}`}
              initial={{ opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{
                duration: 0.6,
                ease: 'easeOut',
                delay: (i % 3) * 0.08,
              }}
              className={`group relative overflow-hidden rounded-2xl border border-gold/20 bg-card/30 ${
                spans[i] ?? ''
              }`}
            >
              <img
                src={src || fallbackImages[i]}
                alt={`Wedding moment ${i + 1}`}
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                onError={(event) => {
                  event.currentTarget.src = fallbackImages[i] || '/placeholder.svg'
                }}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-30" />
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  )
}