'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { easeLuxury } from '@/lib/motion'

export function BismillahTransition() {
  const reduceMotion = useReducedMotion()

  return (
    <section
      className="relative py-24 md:py-32"
      aria-label="Opening prayer — Ar-Rum 21"
    >
      <div className="mx-auto max-w-3xl px-6 text-center safe-x">
        {/* Top ornament */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true, margin: '-10% 0px -10% 0px' }}
          transition={{ duration: 1.2, ease: easeLuxury }}
          className="mx-auto mb-12 flex items-center justify-center gap-3 md:mb-16"
        >
          <span className="block h-px w-12 bg-gradient-to-l from-gold/60 to-transparent md:w-24" />
          <span className="text-fluid-base text-gold/75">✦</span>
          <span className="block h-px w-12 bg-gradient-to-r from-gold/60 to-transparent md:w-24" />
        </motion.div>

        {/* Bismillah — Aldhabi, large & luminous */}
        <motion.p
          dir="rtl"
          lang="ar"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-15% 0px -15% 0px' }}
          transition={{
            duration: reduceMotion ? 0 : 1.4,
            delay: reduceMotion ? 0 : 0.2,
            ease: easeLuxury,
          }}
          className="font-aldhabi text-fluid-4xl leading-[1.6] text-gradient-gold md:text-fluid-5xl"
        >
          بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
        </motion.p>

        {/* Divider between Bismillah and verse */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.8, ease: easeLuxury }}
          className="mx-auto my-12 h-px w-24 bg-gradient-to-r from-transparent via-gold/40 to-transparent md:my-16 md:w-32"
        />

        {/* Arabic verse — Aldhabi, medium */}
        <motion.p
          dir="rtl"
          lang="ar"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-15% 0px -15% 0px' }}
          transition={{
            duration: reduceMotion ? 0 : 1.4,
            delay: reduceMotion ? 0 : 1.0,
            ease: easeLuxury,
          }}
          className="font-aldhabi text-fluid-2xl leading-[2] text-cream/90 md:text-fluid-3xl"
        >
          وَمِنْ اٰيٰتِهٖٓ اَنْ خَلَقَ لَكُمْ مِّنْ اَنْفُسِكُمْ اَزْوَاجًا لِّتَسْكُنُوْٓا اِلَيْهَا وَجَعَلَ بَيْنَكُمْ مَّوَدَّةً وَّرَحْمَةً ۚ اِنَّ فِيْ ذٰلِكَ لَاٰيٰتٍ لِّقَوْمٍ يَّتَفَكَّرُوْنَ
        </motion.p>

        {/* English translation — Kepler */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-15% 0px -15% 0px' }}
          transition={{
            duration: reduceMotion ? 0 : 1.2,
            delay: reduceMotion ? 0 : 1.6,
            ease: easeLuxury,
          }}
          className="mx-auto mt-12 max-w-2xl font-kepler text-fluid-base leading-relaxed text-cream/80 md:mt-16 md:text-fluid-lg"
        >
          &ldquo;And among His signs is that He created for you mates from among
          yourselves, that you may find tranquility in them; and He placed between
          you affection and mercy. Indeed in that are signs for a people who give
          thought.&rdquo;
        </motion.p>

        {/* Citation — Kepler small */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 2 }}
          className="mt-4 font-kepler text-fluid-sm tracking-[0.2em] text-gold/85"
        >
          (QS. Ar-Rum: 21)
        </motion.p>

        {/* Bottom ornament */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true, margin: '-10% 0px -10% 0px' }}
          transition={{ duration: 1.2, delay: 0.5, ease: easeLuxury }}
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