'use client'

import { motion } from 'framer-motion'
import { Clock, MapPin } from 'lucide-react'
import { wedding } from '@/lib/wedding-config'
import { SectionHeading } from './section-heading'
import { Divider } from './divider'
import { fadeUp, staggerContainer, viewportDefaults } from '@/lib/motion'

function EventCard({
  label,
  time,
  venue,
  address,
  note,
}: {
  label: string
  time: string
  venue: string
  address: string
  note: string
}) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="group relative overflow-hidden rounded-2xl border border-gold/20 bg-card/40 p-7 backdrop-blur-sm md:p-10"
    >
      {/* Subtle gold glow on hover */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-gold/0 via-gold/0 to-gold/0 transition-all duration-500 group-hover:from-gold/[0.04] group-hover:to-gold/[0.08]" />

      <p className="font-mono text-fluid-xs uppercase tracking-[0.35em] text-gold/80">
        {label}
      </p>

      <div className="mt-5 flex items-center gap-3 text-gold">
        <Clock className="h-5 w-5 shrink-0" aria-hidden />
        <span className="font-mono text-fluid-sm tracking-wider">{time}</span>
      </div>

      <h3 className="mt-5 font-heading text-fluid-2xl font-light italic text-cream md:mt-6">
        {venue}
      </h3>

      <div className="mt-3 flex items-start gap-3 text-cream/80">
        <MapPin className="mt-1 h-4 w-4 shrink-0 text-gold/70" aria-hidden />
        <p className="font-sans text-fluid-base leading-relaxed">{address}</p>
      </div>

      <p className="mt-6 font-sans text-fluid-base leading-relaxed text-cream/75 md:mt-8">
        {note}
      </p>
    </motion.div>
  )
}

export function EventDetails() {
  return (
    <section className="relative px-6 py-24 safe-x md:py-32">
      <SectionHeading subtitle="The Celebration" title="When & Where" />

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewportDefaults}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto mb-12 max-w-2xl text-center font-heading text-fluid-xl font-light italic leading-snug text-cream/90 md:mb-16"
      >
        {wedding.date.full}
      </motion.p>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={viewportDefaults}
        className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2 md:gap-8"
      >
        <EventCard label="The Ceremony" {...wedding.ceremony} />
        <EventCard label="The Reception" {...wedding.reception} />
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={viewportDefaults}
        transition={{ duration: 1, delay: 0.3 }}
        className="mx-auto mt-10 max-w-2xl px-2 text-center font-sans text-fluid-sm italic text-cream/65 md:mt-14"
      >
        {wedding.shuttleNote}
      </motion.p>

      <Divider />
    </section>
  )
}