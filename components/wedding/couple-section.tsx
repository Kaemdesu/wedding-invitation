'use client'

import { motion } from 'framer-motion'
import { wedding } from '@/lib/wedding-config'
import { SectionHeading } from './section-heading'
import { Divider } from './divider'

function Portrait({
  person,
  align,
  delay,
}: {
  person: { name: string; bio: string; photo: string }
  align: 'left' | 'right'
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: align === 'left' ? -40 : 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.8, ease: 'easeOut', delay }}
      className="flex flex-col items-center text-center"
    >
      <div className="relative">
        <div className="absolute -inset-3 rounded-full border border-gold/30" />
        <div className="size-48 overflow-hidden rounded-full border border-gold/50 glow-gold sm:size-56">
          <img
            src={person.photo || '/placeholder.svg'}
            alt={person.name}
            className="h-full w-full object-cover"
          />
        </div>
      </div>
      <h3 className="font-heading mt-8 text-3xl font-medium text-cream sm:text-4xl">
        {person.name}
      </h3>
      <p className="mt-4 max-w-xs text-pretty font-sans text-lg leading-relaxed text-muted-foreground">
        {person.bio}
      </p>
    </motion.div>
  )
}

export function CoupleSection() {
  return (
    <section className="relative bg-background px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeading subtitle="Our Story" title="The Couple" />
        <Divider />

        <div className="mt-12 grid grid-cols-1 items-center gap-14 md:grid-cols-[1fr_auto_1fr] md:gap-8">
          <Portrait person={wedding.groom} align="left" delay={0} />

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.15 }}
            className="flex flex-col items-center"
          >
            <span className="font-heading text-7xl text-gradient-gold sm:text-8xl">
              &amp;
            </span>
            <p className="mt-2 max-w-[10rem] text-center font-sans text-base uppercase tracking-[0.25em] text-gold">
              Two souls, one journey
            </p>
          </motion.div>

          <Portrait person={wedding.bride} align="right" delay={0.1} />
        </div>
      </div>
    </section>
  )
}
