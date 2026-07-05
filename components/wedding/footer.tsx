'use client'

import { motion } from 'framer-motion'
import { wedding } from '@/lib/wedding-config'
import { fadeUp, staggerContainer, viewportDefaults } from '@/lib/motion'

export function Footer() {
  return (
    <footer className="relative left-1/2 right-1/2 -mx-[50vw] flex min-h-screen w-screen items-center justify-center overflow-hidden">
      {/* The couple photo — top fades in smoothly, bottom stays fully visible */}
      <div
        aria-hidden
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/images/footer-couple.jpg)',
          maskImage:
            'linear-gradient(to bottom, transparent 0%, transparent 5%, rgba(0,0,0,0.15) 15%, rgba(0,0,0,0.4) 25%, rgba(0,0,0,0.7) 38%, black 50%, black 100%)',
          WebkitMaskImage:
            'linear-gradient(to bottom, transparent 0%, transparent 5%, rgba(0,0,0,0.15) 15%, rgba(0,0,0,0.4) 25%, rgba(0,0,0,0.7) 38%, black 50%, black 100%)',
        }}
      />

      {/* Soft dark overlay so text stays readable (photo still visible) */}
      <div
        aria-hidden
        className="absolute inset-0 bg-background/30"
      />

      {/* Gold ambient glow behind names */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/[0.08] blur-[140px]"
      />

      {/* Centered content */}
      <div className="relative z-10 flex w-full items-center justify-center px-6 py-24 safe-x safe-top safe-bottom">
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
            className="font-heading text-fluid-5xl font-light italic leading-[0.95] text-gradient-gold [text-shadow:0_2px_40px_oklch(0.12_0.012_270/0.95),0_0_80px_oklch(0.12_0.012_270/0.7)] md:text-fluid-6xl"
          >
            {wedding.groom.shortName}
            <span className="mx-3 text-gold/70 md:mx-4">&</span>
            {wedding.bride.shortName}
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="mt-8 font-mono text-fluid-sm uppercase tracking-[0.35em] text-cream/90 [text-shadow:0_2px_20px_oklch(0.12_0.012_270/0.95)] md:mt-10 md:tracking-[0.45em]"
          >
            {wedding.date.short}
          </motion.p>

          <motion.p
            variants={fadeUp}
            className="mt-3 font-sans text-fluid-base italic text-cream/85 [text-shadow:0_2px_20px_oklch(0.12_0.012_270/0.95)]"
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
            className="mt-8 font-mono text-fluid-xs uppercase tracking-[0.3em] text-cream/70 [text-shadow:0_2px_15px_oklch(0.12_0.012_270/0.95)] md:mt-10"
          >
            Made with love · 2026
          </motion.p>
        </motion.div>
      </div>
    </footer>
  )
}