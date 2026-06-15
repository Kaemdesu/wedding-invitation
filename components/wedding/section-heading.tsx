'use client'

import { motion } from 'framer-motion'

export function SectionHeading({
  subtitle,
  title,
}: {
  subtitle: string
  title: string
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="font-sans text-sm font-semibold uppercase tracking-[0.4em] text-gold"
      >
        {subtitle}
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
        className="font-heading mt-3 text-balance text-4xl font-medium text-cream sm:text-5xl md:text-6xl"
      >
        {title}
      </motion.h2>
    </div>
  )
}
