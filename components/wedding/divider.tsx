'use client'

import { motion } from 'framer-motion'

export function Divider() {
  return (
    <motion.div
      initial={{ opacity: 0, scaleX: 0.4 }}
      whileInView={{ opacity: 1, scaleX: 1 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 1, ease: 'easeOut' }}
      className="flex items-center justify-center gap-4 py-2"
      aria-hidden="true"
    >
      <span className="h-px w-16 bg-gradient-to-r from-transparent to-gold/70 sm:w-28" />
      <span className="relative flex items-center justify-center">
        <span className="block size-2 rotate-45 bg-gold" />
        <span className="absolute size-3.5 rotate-45 border border-gold/50" />
      </span>
      <span className="h-px w-16 bg-gradient-to-l from-transparent to-gold/70 sm:w-28" />
    </motion.div>
  )
}
