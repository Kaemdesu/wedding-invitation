'use client'

import { motion } from 'framer-motion'
import { wedding } from '@/lib/wedding-config'
import { SectionHeading } from './section-heading'
import { Divider } from './divider'

// Bento spans for a varied masonry feel
const spans = [
  'sm:col-span-2 sm:row-span-2',
  'sm:col-span-1 sm:row-span-1',
  'sm:col-span-1 sm:row-span-1',
  'sm:col-span-1 sm:row-span-2',
  'sm:col-span-1 sm:row-span-1',
  'sm:col-span-2 sm:row-span-1',
]

export function Gallery() {
  return (
    <section className="relative bg-background px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeading subtitle="Captured Moments" title="Our Gallery" />
        <Divider />

        <div className="mt-12 grid auto-rows-[180px] grid-cols-2 gap-4 sm:auto-rows-[200px] sm:grid-cols-3">
          {wedding.gallery.map((src, i) => (
            <motion.figure
              key={src}
              initial={{ opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: (i % 3) * 0.08 }}
              className={`group relative overflow-hidden rounded-2xl border border-gold/20 ${spans[i]}`}
            >
              <img
                src={src || '/placeholder.svg'}
                alt={`Wedding moment ${i + 1}`}
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-30" />
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  )
}
