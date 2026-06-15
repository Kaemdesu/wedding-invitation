'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import dynamic from 'next/dynamic'
import { useRef } from 'react'
import { wedding } from '@/lib/wedding-config'

const RingScene = dynamic(
  () => import('./ring-scene').then((m) => m.RingScene),
  { ssr: false },
)

export function Hero() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })

  // Phase 1 text
  const t1Opacity = useTransform(scrollYProgress, [0, 0.06, 0.16, 0.22], [0, 1, 1, 0])
  const t1Y = useTransform(scrollYProgress, [0, 0.22], [30, -30])

  // Phase 2 text
  const t2Opacity = useTransform(scrollYProgress, [0.24, 0.3, 0.42, 0.48], [0, 1, 1, 0])
  const t2Y = useTransform(scrollYProgress, [0.24, 0.48], [30, -30])

  // Satin + roses background fades in
  const satinOpacity = useTransform(scrollYProgress, [0.5, 0.78], [0, 1])
  const darkOverlay = useTransform(scrollYProgress, [0.5, 0.85], [0.85, 0.45])

  // Final reveal
  const revealOpacity = useTransform(scrollYProgress, [0.7, 0.8], [0, 1])
  const revealY = useTransform(scrollYProgress, [0.7, 0.92], [40, 0])
  const namesOpacity = useTransform(scrollYProgress, [0.82, 0.92], [0, 1])
  const namesScale = useTransform(scrollYProgress, [0.82, 1], [0.92, 1])

  // Ring fades out at the very end to let names shine
  const ringOpacity = useTransform(scrollYProgress, [0, 0.7, 0.92], [1, 1, 0.15])
  const scrollHint = useTransform(scrollYProgress, [0, 0.08], [1, 0])

  return (
    <section ref={ref} className="relative h-[460vh]">
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden">
        {/* Base dark gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,oklch(0.2_0.03_75/0.5),oklch(0.1_0.012_270)_70%)]" />

        {/* Satin + roses background */}
        <motion.div style={{ opacity: satinOpacity }} className="absolute inset-0">
          <img
            src="/images/satin-roses.png"
            alt=""
            className="h-full w-full object-cover"
          />
          <motion.div
            style={{ opacity: darkOverlay }}
            className="absolute inset-0 bg-background"
          />
        </motion.div>

        {/* 3D Ring */}
        <motion.div style={{ opacity: ringOpacity }} className="absolute inset-0">
          <RingScene progress={scrollYProgress} />
        </motion.div>

        {/* Phase 1 */}
        <motion.h1
          style={{ opacity: t1Opacity, y: t1Y }}
          className="font-heading pointer-events-none absolute px-6 text-center text-4xl font-medium text-cream sm:text-6xl md:text-7xl"
        >
          A Love Forged in Time
        </motion.h1>

        {/* Phase 2 */}
        <motion.h2
          style={{ opacity: t2Opacity, y: t2Y }}
          className="font-heading pointer-events-none absolute px-6 text-center text-3xl font-medium text-cream sm:text-5xl md:text-6xl"
        >
          Two Souls, One Beautiful Journey
        </motion.h2>

        {/* Final reveal */}
        <div className="pointer-events-none absolute flex flex-col items-center px-6 text-center">
          <motion.p
            style={{ opacity: revealOpacity, y: revealY }}
            className="font-sans text-sm font-semibold uppercase tracking-[0.5em] text-gold sm:text-base"
          >
            Are Getting Married
          </motion.p>
          <motion.div
            style={{ opacity: namesOpacity, scale: namesScale }}
            className="mt-4 flex flex-col items-center"
          >
            <span className="font-heading text-5xl font-semibold text-gradient-gold sm:text-7xl md:text-8xl">
              {wedding.groom.shortName}
            </span>
            <span className="font-heading my-1 text-3xl text-gold sm:text-5xl">&amp;</span>
            <span className="font-heading text-5xl font-semibold text-gradient-gold sm:text-7xl md:text-8xl">
              {wedding.bride.shortName}
            </span>
            <span className="mt-5 font-sans text-lg tracking-[0.3em] text-cream/80">
              {wedding.date.short}
            </span>
          </motion.div>
        </div>

        {/* Scroll hint */}
        <motion.div
          style={{ opacity: scrollHint }}
          className="absolute bottom-10 flex flex-col items-center gap-2"
        >
          <span className="font-sans text-xs uppercase tracking-[0.35em] text-cream/60">
            Scroll
          </span>
          <span className="h-10 w-px bg-gradient-to-b from-gold to-transparent" />
        </motion.div>
      </div>
    </section>
  )
}
