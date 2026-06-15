'use client'

import { motion } from 'framer-motion'
import { wedding } from '@/lib/wedding-config'
import { Divider } from './divider'

export function Footer() {
  return (
    <footer className="relative bg-background px-6 pb-16 pt-8 text-center">
      <Divider />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="mx-auto mt-8 flex max-w-xl flex-col items-center"
      >
        <div className="flex items-center justify-center gap-4">
          <span className="font-heading text-3xl text-cream sm:text-4xl">
            {wedding.groom.shortName}
          </span>
          <span className="font-heading text-3xl text-gradient-gold sm:text-4xl">&amp;</span>
          <span className="font-heading text-3xl text-cream sm:text-4xl">
            {wedding.bride.shortName}
          </span>
        </div>

        <p className="mt-4 font-sans text-lg tracking-[0.3em] text-gold">
          {wedding.date.short}
        </p>
        <p className="mt-1 font-sans text-base uppercase tracking-[0.25em] text-muted-foreground">
          {wedding.city}
        </p>

        <span className="my-7 h-px w-24 bg-gold/30" />

        <p className="font-sans text-base text-muted-foreground">
          Made with love · 2026
        </p>
      </motion.div>
    </footer>
  )
}
