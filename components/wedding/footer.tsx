'use client'

import { motion } from 'framer-motion'
import { wedding } from '@/lib/wedding-config'
import { Divider } from './divider'
import { fadeUp, staggerContainer, viewportDefaults } from '@/lib/motion'

export function Footer() {
  return (
    <footer className="relative px-6 pb-16 pt-12 safe-x safe-bottom md:pb-24 md:pt-16">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={viewportDefaults}
        className="mx-auto max-w-3xl text-center"
      >
        <motion.h2
          variants={fadeUp}
          className="font-heading text-fluid-5xl font-light italic leading-[0.95] text-gradient-gold"
        >
          {wedding.groom.shortName}
          <span className="mx-2 text-gold/60 md:mx-3">&</span>
          {wedding.bride.shortName}
        </motion.h2>

        <motion.p
          variants={fadeUp}
          className="mt-6 font-mono text-fluid-sm uppercase tracking-[0.35em] text-cream/80 md:tracking-[0.45em]"
        >
          {wedding.date.short}
        </motion.p>

        <motion.p
          variants={fadeUp}
          className="mt-2 font-sans text-fluid-base italic text-cream/70"
        >
          {wedding.city}
        </motion.p>

        <Divider />

        <motion.p
          variants={fadeUp}
          className="font-mono text-fluid-xs uppercase tracking-[0.3em] text-cream/50"
        >
          Made with love · 2026
        </motion.p>
      </motion.div>
    </footer>
  )
}