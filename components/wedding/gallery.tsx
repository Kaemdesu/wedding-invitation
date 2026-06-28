'use client'

import { motion } from 'framer-motion'
import { wedding } from '@/lib/wedding-config'
import { SectionHeading } from './section-heading'
import { Divider } from './divider'
import { staggerFast, fadeUp, viewportDefaults } from '@/lib/motion'

const fallbackImages = [
  '/images/gallery-1.webp',
  '/images/gallery-2.webp',
  '/images/gallery-3.webp',
  '/images/gallery-4.webp',
  '/images/gallery-5.webp',
  '/images/gallery-6.webp',
]

const spans = [
  'col-span-2 row-span-2 md:col-span-4 md:row-span-2',
  'col-span-1 row-span-1 md:col-span-2 md:row-span-1',
  'col-span-1 row-span-1 md:col-span-2 md:row-span-1',
  'col-span-1 row-span-1 md:col-span-2 md:row-span-1',
  'col-span-1 row-span-1 md:col-span-2 md:row-span-1',
  'col-span-2 row-span-1 md:col-span-2 md:row-span-1',
]

export function Gallery() {
  const galleryImages = [...wedding.gallery]
  while (galleryImages.length < 6) {
    galleryImages.push(fallbackImages[galleryImages.length])
  }
  const images = galleryImages.slice(0, 6)

  return (
    <section className="relative px-6 py-24 safe-x md:py-32">
      <SectionHeading subtitle="Memories" title="Moments to remember" />

      <motion.div
        variants={staggerFast}
        initial="hidden"
        whileInView="show"
        viewport={viewportDefaults}
        className="mx-auto grid max-w-6xl auto-rows-[180px] grid-cols-2 gap-3 sm:auto-rows-[220px] sm:gap-4 md:auto-rows-[260px] md:grid-cols-6"
      >
        {images.map((src, i) => (
          <motion.div
            key={i}
            variants={fadeUp}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className={`group relative overflow-hidden rounded-xl border border-gold/15 ${spans[i]}`}
          >
            <img
              src={src}
              alt={`Wedding moment ${i + 1}`}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110 gpu"
              onError={(e) => {
                const target = e.currentTarget
                if (!target.dataset.fallback) {
                  target.dataset.fallback = 'true'
                  target.src = fallbackImages[i] || '/placeholder.svg'
                }
              }}
            />
            <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-background/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </motion.div>
        ))}
      </motion.div>

      <Divider />
    </section>
  )
}