'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { wedding } from '@/lib/wedding-config'
import { SectionHeading } from './section-heading'
import { Divider } from './divider'
import { fadeUp, staggerContainer, viewportDefaults, easeLuxury } from '@/lib/motion'

type TimeLeft = {
  days: number
  hours: number
  minutes: number
  seconds: number
  total: number
}

/** Calculate time difference between now and target */
function getTimeLeft(target: Date): TimeLeft {
  const total = target.getTime() - Date.now()
  if (total <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 }

  return {
    days: Math.floor(total / (1000 * 60 * 60 * 24)),
    hours: Math.floor((total / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((total / 1000 / 60) % 60),
    seconds: Math.floor((total / 1000) % 60),
    total,
  }
}

function pad(n: number) {
  return n.toString().padStart(2, '0')
}

function TimeUnit({
  value,
  label,
  delay = 0,
}: {
  value: number
  label: string
  delay?: number
}) {
  return (
    <motion.div
      variants={fadeUp}
      transition={{ delay, duration: 0.8, ease: easeLuxury }}
      className="flex flex-col items-center"
    >
      <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-gold/25 bg-card/30 backdrop-blur-sm sm:h-24 sm:w-24 md:h-28 md:w-28 lg:h-32 lg:w-32">
        {/* Subtle gold glow */}
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-gold/10 to-transparent" />

        {/* The number itself — animated key change for smoother updates */}
        <motion.span
          key={value}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: easeLuxury }}
          className="relative font-heading text-fluid-4xl font-light italic text-gradient-gold md:text-fluid-5xl"
        >
          {pad(value)}
        </motion.span>
      </div>
      <p className="mt-3 font-mono text-fluid-xs uppercase tracking-[0.3em] text-cream/70 md:mt-4 md:tracking-[0.4em]">
        {label}
      </p>
    </motion.div>
  )
}

export function Countdown() {
  const target = new Date(`${wedding.date.iso}T09:00:00+07:00`) // 09:00 WIB akad
  const reduceMotion = useReducedMotion()

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => getTimeLeft(target))
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const tick = () => setTimeLeft(getTimeLeft(target))
    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // SSR fallback (no flash of wrong numbers)
  if (!mounted) {
    return (
      <section className="relative px-6 py-24 safe-x md:py-32">
        <SectionHeading subtitle="Counting the moments" title="Until forever" />
        <div className="mx-auto max-w-3xl">
          <div className="grid grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {['Days', 'Hours', 'Minutes', 'Seconds'].map((label) => (
              <div key={label} className="flex flex-col items-center">
                <div className="h-20 w-20 rounded-2xl border border-gold/15 bg-card/20 sm:h-24 sm:w-24 md:h-28 md:w-28 lg:h-32 lg:w-32" />
                <p className="mt-3 font-mono text-fluid-xs uppercase tracking-[0.3em] text-cream/40 md:mt-4">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
        <Divider />
      </section>
    )
  }

  // Wedding day arrived 🎉
  if (timeLeft.total <= 0) {
    return (
      <section className="relative px-6 py-24 safe-x md:py-32">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={viewportDefaults}
          transition={{ duration: 1, ease: easeLuxury }}
          className="mx-auto max-w-3xl text-center"
        >
          {!reduceMotion && (
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="mx-auto mb-6 text-fluid-4xl"
            >
              🎉
            </motion.div>
          )}
          <p className="font-mono text-fluid-xs uppercase tracking-[0.4em] text-gold/80">
            Today is the day
          </p>
          <h2 className="mt-4 font-heading text-fluid-5xl font-light italic leading-tight text-gradient-gold md:text-fluid-6xl">
            We&apos;re getting married
          </h2>
          <p className="mt-8 font-sans text-fluid-base italic text-cream/80">
            Thank you for being part of our story. ✨
          </p>
        </motion.div>
        <Divider />
      </section>
    )
  }

  return (
    <section className="relative px-6 py-24 safe-x md:py-32">
      <SectionHeading subtitle="Counting the moments" title="Until forever" />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={viewportDefaults}
        className="mx-auto max-w-3xl"
      >
        {/* The countdown grid */}
        <div className="grid grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          <TimeUnit value={timeLeft.days} label="Days" delay={0} />
          <TimeUnit value={timeLeft.hours} label="Hours" delay={0.08} />
          <TimeUnit value={timeLeft.minutes} label="Minutes" delay={0.16} />
          <TimeUnit value={timeLeft.seconds} label="Seconds" delay={0.24} />
        </div>

        {/* Wedding date footnote */}
        <motion.p
          variants={fadeUp}
          className="mt-10 text-center font-heading text-fluid-lg font-light italic text-cream/85 md:mt-14 md:text-fluid-xl"
        >
          Saturday, the 8<sup className="text-fluid-xs">th</sup> of August, 2026
          <span className="mx-3 text-gold/60">·</span>
          09:00 WIB
        </motion.p>

        <motion.p
          variants={fadeUp}
          className="mt-4 text-center font-mono text-fluid-xs uppercase tracking-[0.3em] text-gold/70 md:tracking-[0.4em]"
        >
          ✦ Until forever ✦
        </motion.p>
      </motion.div>

      <Divider />
    </section>
  )
}