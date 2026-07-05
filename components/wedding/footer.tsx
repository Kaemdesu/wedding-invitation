'use client'

import { motion } from 'framer-motion'
import { wedding } from '@/lib/wedding-config'
import { fadeUp, staggerContainer, viewportDefaults } from '@/lib/motion'

export function Footer() {
  return (
    <footer className="relative left-1/2 right-1/2 -mx-[50vw] w-screen overflow-hidden">
      {/* Smooth transition FROM page background INTO the photo */}
      <div
        aria-hidden
        className="relative h-40 w-full bg-gradient-to-b from-background via-background/60 to-transparent md:h-56"
      />

      {/* Photo section */}
      <div className="relative">
        {/* The couple photo */}
        <div
          aria-hidden
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/images/footer-couple.jpg)' }}
        />

        {/* Light dark overlay so text stays readable (photo still visible) */}
        <div
          aria-hidden
          className="absolute inset-0 bg-background/35"
        />

        {/* Top fade — blends photo into page above */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-background to-transparent"
        />

        {/* Bottom fade */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background/80 to-transparent"
        />

        {/* Gold ambient glow behind names */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/[0.08] blur-[120px]"
        />

        {/* Content */}
        <div className="relative px-6 pb-20 pt-32 safe-x safe-bottom md:pb-28 md:pt-48">
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
              className="font-heading text-fluid-5xl font-light italic leading-[0.95] text-gradient-gold [text-shadow:0_2px_30px_oklch(0.12_0.012_270/0.9)] md:text-fluid-6xl"
            >
              {wedding.groom.shortName}
              <span className="mx-3 text-gold/70 md:mx-4">&</span>
              {wedding.bride.shortName}
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="mt-8 font-mono text-fluid-sm uppercase tracking-[0.35em] text-cream/90 [text-shadow:0_2px_20px_oklch(0.12_0.012_270/0.9)] md:mt-10 md:tracking-[0.45em]"
            >
              {wedding.date.short}
            </motion.p>

            <motion.p
              variants={fadeUp}
              className="mt-3 font-sans text-fluid-base italic text-cream/80 [text-shadow:0_2px_20px_oklch(0.12_0.012_270/0.9)]"
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
              className="mt-8 font-mono text-fluid-xs uppercase tracking-[0.3em] text-cream/60 [text-shadow:0_2px_15px_oklch(0.12_0.012_270/0.9)] md:mt-10"
            >
              Made with love · 2026
            </motion.p>
          </motion.div>
        </div>
      </div>
    </footer>
  )
}