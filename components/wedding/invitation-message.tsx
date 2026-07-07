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
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-15% 0px -15% 0px' }}
          transition={{
            duration: reduceMotion ? 0 : 1.0,
            delay: reduceMotion ? 0 : 0.2,
            ease: easeLuxury,
          }}
          className="font-mono text-fluid-xs uppercase tracking-[0.4em] text-gold/85 md:tracking-[0.45em]"
        >
          An Invitation
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-15% 0px -15% 0px' }}
          transition={{
            duration: reduceMotion ? 0 : 1.3,
            delay: reduceMotion ? 0 : 0.5,
            ease: easeLuxury,
          }}
          className="mt-10 font-heading text-fluid-2xl font-light italic leading-snug text-cream md:mt-14 md:text-fluid-3xl"
        >
          As one chapter is preserved for a lifetime,
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-15% 0px -15% 0px' }}
          transition={{
            duration: reduceMotion ? 0 : 1.3,
            delay: reduceMotion ? 0 : 1.0,
            ease: easeLuxury,
          }}
          className="mt-4 font-heading text-fluid-2xl font-light italic leading-snug text-gradient-gold md:mt-6 md:text-fluid-3xl"
        >
          we invite you to celebrate its beginning with us.
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{
            duration: reduceMotion ? 0 : 1,
            delay: reduceMotion ? 0 : 1.6,
          }}
          className="mt-10 font-poppins font-light text-fluid-sm tracking-[0.25em] text-cream/70 md:mt-14"
        >
          — {wedding.groom.shortName} &amp; {wedding.bride.shortName}, together with our families
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true, margin: '-10% 0px -10% 0px' }}
          transition={{
            duration: reduceMotion ? 0 : 1.2,
            delay: reduceMotion ? 0 : 1.4,
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