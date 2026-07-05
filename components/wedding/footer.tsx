'use client'

import { motion } from 'framer-motion'
import { wedding } from '@/lib/wedding-config'
import { fadeUp, staggerContainer, viewportDefaults } from '@/lib/motion'

export function Footer() {
  return (
    <footer className="relative overflow-hidden">
      {/* Background photo with transparency */}
      <div
        aria-hidden
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
        style={{ backgroundImage: 'url(/images/footer-couple.jpg)' }}
      />

      {/* Top gradient — smooth transition from page background into the photo */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-background via-background/80 to-transparent"
      />

      {/* Bottom vignette for depth */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background/70 to-transparent"
      />

      {/* Soft dark overlay so text stays readable */}
      <div
        aria-hidden
        className="absolute inset-0 bg-background/45"
      />

      {/* Ambient gold glow behind names */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/[0.06] blur-[120px]"
      />

      <div className="relative px-6 pb-20 pt-32 safe-x safe-bottom md:pb-28 md:pt-40">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={viewportDefaults}
          className="mx-auto flex max-w-3xl flex-col items-center justify-center text-center"
        >
          <motion.div
            variants={fadeUp}
            className="mb-8 flex items-center justify-center gap-3 md:mb-10"
          >
            <span className="block h-px w-12 bg-gradient-to-l from-gold/60 to-transparent md:w-20" />
            <span className="text-fluid-base text-gold/75">✦</span>
            <span className="block h-px w-12 bg-gradient-to-r from-gold/60 to-transparent md:w-20" />
          </motion.div>

          <motion.h2
            variants={fadeUp}
            className="font-heading text-fluid-5xl font-light italic leading-[0.95] text-gradient-gold md:text-fluid-6xl"
          >
            {wedding.groom.shortName}
            <span className="mx-3 text-gold/70 md:mx-4">&</span>
            {wedding.bride.shortName}
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="mt-8 font-mono text-fluid-sm uppercase tracking-[0.35em] text-cream/85 md:mt-10 md:tracking-[0.45em]"
          >
            {wedding.date.short}
          </motion.p>

          <motion.p
            variants={fadeUp}
            className="mt-3 font-sans text-fluid-base italic text-cream/75"
          >
            {wedding.city}
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-10 flex items-center justify-center gap-3 md:mt-14"
          >
            <span className="block h-px w-10 bg-gradient-to-l from-gold/40 to-transparent md:w-16" />
            <span className="text-fluid-xs text-gold/60">✦</span>
            <span className="block h-px w-10 bg-gradient-to-r from-gold/40 to-transparent md:w-16" />
          </motion.div>

          <motion.p
            variants={fadeUp}
            className="mt-8 font-mono text-fluid-xs uppercase tracking-[0.3em] text-cream/55 md:mt-10"
          >
            Made with love · 2026
          </motion.p>
        </motion.div>
      </div>
    </footer>
  )
}