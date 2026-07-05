'use client'

import { motion } from 'framer-motion'
import { wedding } from '@/lib/wedding-config'
import { SectionHeading } from './section-heading'
import { fadeUp, staggerContainer, viewportDefaults } from '@/lib/motion'

type Person = { name: string; bio: string; photo: string }

function Portrait({ person, align }: { person: Person; align: 'left' | 'right' }) {
  const alignClass = align === 'left' ? 'md:items-start md:text-left' : 'md:items-end md:text-right'
  return (
    <motion.div variants={fadeUp} className={'flex flex-col items-center text-center ' + alignClass}>
      <div
        role="img"
        aria-label={person.name}
        className="relative aspect-[3/4] w-72 bg-contain bg-center bg-no-repeat sm:w-80 md:w-96 lg:w-[26rem]"
        style={{ backgroundImage: 'url(' + person.photo + ')' }}
      />
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
    </section>
  )
}