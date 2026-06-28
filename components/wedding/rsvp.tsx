'use client'

import { motion } from 'framer-motion'
import { Check, Heart, X } from 'lucide-react'
import { useState } from 'react'
import { wedding } from '@/lib/wedding-config'
import { SectionHeading } from './section-heading'
import { Divider } from './divider'
import { fadeUp, staggerContainer, viewportDefaults } from '@/lib/motion'

type Attendance = 'accept' | 'decline'

const GOOGLE_SHEETS_URL =
  'https://script.google.com/macros/s/AKfycbxUycJDbXHoP4k0cqBrEjhHCNFUcJ9F8HQiOHVrL6Uj8aFqNZfpYdPZCCeQQwHtq6w/exec'

const fieldClass =
  'w-full rounded-lg border border-gold/25 bg-background/60 px-4 py-3 font-sans text-fluid-base text-cream placeholder:text-muted-foreground/60 outline-none transition focus:border-gold focus:ring-1 focus:ring-gold/50 touch-target'

const labelClass =
  'mb-2 block font-mono text-fluid-xs font-semibold uppercase tracking-[0.2em] text-gold'

function sendToGoogleSheets(data: Record<string, string>): Promise<void> {
  return new Promise((resolve) => {
    const params = new URLSearchParams(data).toString()
    const url = `${GOOGLE_SHEETS_URL}?${params}`
    const img = new Image()
    img.onload = () => resolve()
    img.onerror = () => resolve()
    img.src = url
    setTimeout(resolve, 3000)
  })
}

export function Rsvp() {
  const [attendance, setAttendance] = useState<Attendance>('accept')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    const form = e.currentTarget
    const data = new FormData(form)
    const payload = {
      fullName: (data.get('fullName') as string) || '',
      email: (data.get('email') as string) || '',
      attendance,
      note: (data.get('note') as string) || '',
    }

    try {
      await sendToGoogleSheets(payload)
      setStatus('success')
      form.reset()
    } catch {
      setErrorMsg('Something went wrong. Please try again.')
      setStatus('error')
    }
  }

  return (
    <section className="relative px-6 py-24 safe-x md:py-32">
      <SectionHeading subtitle="RSVP" title="Will you join us?" />

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewportDefaults}
        transition={{ duration: 0.8 }}
        className="mx-auto mb-10 max-w-xl text-center font-sans text-fluid-base text-cream/80 md:mb-14"
      >
        We hope you will join us on our special day. Kindly let us know by{' '}
        <span className="text-gold">{wedding.rsvpBy}</span>.
      </motion.p>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={viewportDefaults}
        className="mx-auto max-w-xl rounded-2xl border border-gold/20 bg-card/40 p-6 backdrop-blur-sm sm:p-8 md:p-10"
      >
        {status === 'success' ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="py-8 text-center"
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-gold/40 bg-gold/10">
              <Heart className="h-7 w-7 text-gold" />
            </div>
            <h3 className="mt-6 font-heading text-fluid-2xl font-light italic text-gradient-gold">
              Thank You
            </h3>
            <p className="mt-4 font-sans text-fluid-base leading-relaxed text-cream/80">
              Your RSVP has been received. We cannot wait to celebrate this beautiful day
              with you.
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div variants={fadeUp}>
              <label htmlFor="fullName" className={labelClass}>
                Full Name
              </label>
              <input id="fullName" name="fullName" type="text" required className={fieldClass} />
            </motion.div>

            <motion.div variants={fadeUp}>
              <label htmlFor="email" className={labelClass}>
                Email Address
              </label>
              <input id="email" name="email" type="email" required className={fieldClass} />
            </motion.div>

            <motion.div variants={fadeUp}>
              <span className={labelClass}>Will You Attend?</span>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAttendance('accept')}
                  className={`touch-target flex items-center justify-center gap-2 rounded-lg border px-4 py-3 font-sans text-fluid-base transition ${
                    attendance === 'accept'
                      ? 'border-gold bg-gold/15 text-cream glow-gold'
                      : 'border-gold/25 text-muted-foreground hover:border-gold/50'
                  }`}
                >
                  <Check className="h-4 w-4" /> Joyfully Accept
                </button>
                <button
                  type="button"
                  onClick={() => setAttendance('decline')}
                  className={`touch-target flex items-center justify-center gap-2 rounded-lg border px-4 py-3 font-sans text-fluid-base transition ${
                    attendance === 'decline'
                      ? 'border-gold bg-gold/15 text-cream glow-gold'
                      : 'border-gold/25 text-muted-foreground hover:border-gold/50'
                  }`}
                >
                  <X className="h-4 w-4" /> Regretfully Decline
                </button>
              </div>
            </motion.div>

            <motion.div variants={fadeUp}>
              <label htmlFor="note" className={labelClass}>
                A Note for the Couple (Optional)
              </label>
              <textarea id="note" name="note" rows={4} className={`${fieldClass} resize-none`} />
            </motion.div>

            {status === 'error' && (
              <p className="text-center font-sans text-fluid-sm text-destructive">{errorMsg}</p>
            )}

            <motion.button
              variants={fadeUp}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={status === 'loading'}
              className="touch-target w-full rounded-lg bg-gradient-gold px-6 py-4 font-mono text-fluid-sm font-semibold uppercase tracking-[0.25em] text-background transition hover:opacity-90 disabled:opacity-60"
            >
              {status === 'loading' ? 'Sending...' : 'Send RSVP ✦'}
            </motion.button>
          </form>
        )}
      </motion.div>

      <Divider />
    </section>
  )
}