'use client'
import { motion } from 'framer-motion'
import { wedding } from '@/lib/wedding-config'
import { staggerFast, fadeUp, staggerContainer, viewportDefaults } from '@/lib/motion'

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

// Slots 1 & 5 (index 0 & 4) are TALL → best for PORTRAIT photos.
// The rest are landscape-friendly.
const spans = [
  'col-span-1 row-span-2 md:col-span-2 md:row-span-2', // 1 — PORTRAIT (tall)
  'col-span-1 row-span-1 md:col-span-4 md:row-span-1', // 2 — landscape (wide)
  'col-span-1 row-span-1 md:col-span-2 md:row-span-1', // 3 — landscape
  'col-span-2 row-span-1 md:col-span-2 md:row-span-1', // 4 — landscape
  'col-span-1 row-span-2 md:col-span-2 md:row-span-2', // 5 — PORTRAIT (tall)
  'col-span-1 row-span-1 md:col-span-4 md:row-span-1', // 6 — landscape (wide)
  'col-span-1 row-span-1 md:col-span-2 md:row-span-1', // 7 — landscape
  'col-span-2 row-span-1 md:col-span-2 md:row-span-1', // 8 — landscape
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
        className="mb-12 text-center md:mb-16"
      >
        <motion.p
          variants={fadeUp}
          className="font-poppins font-medium text-fluid-xs uppercase tracking-[0.35em] text-gold/80"
        >
          Memories
        </motion.p>
        <motion.h2
          variants={fadeUp}
          className="mt-4 py-2 font-geographica leading-[1.3] text-gradient-gold text-[clamp(2.5rem,5vw,5rem)] md:mt-6"
        >
          Moments to remember
        </motion.h2>
      </motion.div>
      <motion.div variants={staggerFast} initial="hidden" whileInView="show" viewport={viewportDefaults} className="mx-auto grid max-w-6xl auto-rows-[180px] grid-cols-2 gap-3 sm:auto-rows-[220px] sm:gap-4 md:auto-rows-[260px] md:grid-cols-6">
        {images.map((src, i) => {
          const bgStyle = { backgroundImage: 'url(' + src + ')' }
          return (
            <motion.div key={i} variants={fadeUp} whileHover={{ scale: 1.02 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} className={'group relative overflow-hidden rounded-xl border border-gold/15 ' + spans[i]}>
              <div role="img" aria-label={'Wedding moment ' + (i + 1)} style={bgStyle} className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out group-hover:scale-110 gpu" />
              <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-background/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </motion.div>
          )
        })}
      </motion.div>
    </section>
  )
}