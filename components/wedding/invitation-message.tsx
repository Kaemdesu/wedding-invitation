'use client'
import { motion, useReducedMotion } from 'framer-motion'
import { easeLuxury } from '@/lib/motion'
import { wedding } from '@/lib/wedding-config'

export function InvitationMessage() {
  const reduceMotion = useReducedMotion()
  return (
    <section
      className="relative py-24 md:py-32"
      aria-label="Invitation message"
    >
      <div className="mx-auto max-w-3xl px-6 text-center safe-x">
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true, margin: '-10% 0px -10% 0px' }}
          transition={{ duration: reduceMotion ? 0 : 1.2, ease: easeLuxury }}
          className="mx-auto mb-10 flex items-center justify-center gap-3 md:mb-14"
        >
          <span className="block h-px w-12 bg-gradient-to-l from-gold/60 to-transparent md:w-24" />
          <span className="text-fluid-base text-gold/75">✦</span>
          <span className="block h-px w-12 bg-gradient-to-r from-gold/60 to-transparent md:w-24" />
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-15% 0px -15% 0px' }}
          transition={{
            duration: reduceMotion ? 0 : 1.3,
            delay: reduceMotion ? 0 : 0.3,
            ease: easeLuxury,
          }}
          className="font-geographica text-fluid-4xl leading-[1.15] text-cream md:text-fluid-5xl"
        >
          As one chapter is preserved for a lifetime,
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-15% 0px -15% 0px' }}
          transition={{
            duration: reduceMotion ? 0 : 1.3,
            delay: reduceMotion ? 0 : 0.9,
            ease: easeLuxury,
          }}
          className="mt-6 font-geographica text-fluid-4xl leading-[1.15] text-gradient-gold md:mt-8 md:text-fluid-5xl"
        >
          we invite you to celebrate its beginning with us.
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{
            duration: reduceMotion ? 0 : 1,
            delay: reduceMotion ? 0 : 1.5,
          }}
          className="mt-12 font-poppins font-light text-fluid-sm tracking-[0.25em] text-cream/75 md:mt-16"
        >
          — {wedding.groom.shortName} &amp; {wedding.bride.shortName}, together with our families
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true, margin: '-10% 0px -10% 0px' }}
          transition={{
            duration: reduceMotion ? 0 : 1.2,
            delay: reduceMotion ? 0 : 1.3,
            ease: easeLuxury,
          }}
          className="mx-auto mt-12 flex items-center justify-center gap-3 md:mt-16"
        >
          <span className="block h-px w-12 bg-gradient-to-l from-gold/60 to-transparent md:w-24" />
          <span className="text-fluid-base text-gold/75">✦</span>
          <span className="block h-px w-12 bg-gradient-to-r from-gold/60 to-transparent md:w-24" />
        </motion.div>
      </div>
    </section>
  )
}