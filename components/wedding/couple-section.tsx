'use client'

import { motion } from 'framer-motion'
import { wedding } from '@/lib/wedding-config'
import { SectionHeading } from './section-heading'
import { Divider } from './divider'
import { fadeUp, staggerContainer, viewportDefaults } from '@/lib/motion'

function Portrait({
  person,
  align,
}: {
  person: { name: string; bio: string; photo: string }
  align: 'left' | 'right'
}) {
  return (
    <motion.div
      variants={fadeUp}
      className={`flex flex-col items-center text-center ${
        align === 'left' ? 'md:items-start md:text-left' : 'md:items-end md:text-right'
      }`}
    >
      <div className="group relative h-72 w-72 overflow-hidden rounded-2xl border border-gold/20 sm:h-80 sm:w-80 md:h-96 md:w-96">
        <img
          src={person.photo}
          alt={person.name}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105 gpu"
        />
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-background/60 via-transparent to-transparent" />
      </div>
      <h3 className="mt-6 font-heading text-fluid-2xl font-light italic text-gradient-gold md:mt-8">
        {person.name}
      </h3>
      <p className="mt-4 max-w-md font-sans text-fluid-base leading-relaxed text-cream/85">
        {person.bio}
      </p>
    </motion.div>
  )
}

export function CoupleSection() {
  return (
    <section className="relative px-6 py-24 safe-x md:py-32">
      <SectionHeading subtitle="The Bride & The Groom" title="Two souls, one journey" />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={viewportDefaults}
        className="mx-auto grid max-w-6xl gap-16 md:grid-cols-2 md:gap-12 lg:gap-20"
      >
        <Portrait person={wedding.groom} align="left" />
        <Portrait person={wedding.bride} align="right" />
      </motion.div>

      <Divider />
    </section>
  )
}