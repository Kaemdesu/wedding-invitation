'use client'

import { motion } from 'framer-motion'
import { Clock, MapPin } from 'lucide-react'
import { wedding } from '@/lib/wedding-config'
import { SectionHeading } from './section-heading'
import { Divider } from './divider'

function EventCard({
  label,
  time,
  venue,
  address,
  note,
  delay,
}: {
  label: string
  time: string
  venue: string
  address: string
  note: string
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease: 'easeOut', delay }}
      className="relative flex flex-col items-center rounded-2xl border border-gold/25 bg-card/60 p-8 text-center glow-gold backdrop-blur-sm sm:p-10"
    >
      <p className="font-sans text-sm font-semibold uppercase tracking-[0.4em] text-gold">
        {label}
      </p>
      <div className="my-5 flex items-center gap-2 text-cream">
        <Clock className="size-4 text-gold" />
        <span className="font-sans text-xl tracking-wide">{time}</span>
      </div>
      <h3 className="font-heading text-2xl font-medium text-cream sm:text-3xl">
        {venue}
      </h3>
      <div className="mt-3 flex items-center justify-center gap-2 text-muted-foreground">
        <MapPin className="size-4 text-gold/80" />
        <span className="font-sans text-base">{address}</span>
      </div>
      <span className="my-6 h-px w-16 bg-gold/40" />
      <p className="max-w-sm text-pretty font-sans text-base leading-relaxed text-muted-foreground">
        {note}
      </p>
    </motion.div>
  )
}

export function EventDetails() {
  return (
    <section className="relative bg-background px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl">
        <SectionHeading subtitle="Mark Your Calendar" title="Event Details" />
        <Divider />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="font-heading mx-auto mt-6 max-w-2xl text-balance text-center text-2xl italic leading-relaxed text-cream/90 sm:text-3xl"
        >
          {wedding.date.full}
        </motion.p>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
          <EventCard label="Ceremony" {...wedding.ceremony} delay={0} />
          <EventCard label="Reception" {...wedding.reception} delay={0.12} />
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mx-auto mt-10 max-w-xl text-center font-sans text-base italic leading-relaxed text-muted-foreground"
        >
          {wedding.shuttleNote}
        </motion.p>
      </div>
    </section>
  )
}
