'use client'

import { motion } from 'framer-motion'
import { Check, Heart, X } from 'lucide-react'
import { useState } from 'react'
import { wedding } from '@/lib/wedding-config'
import { SectionHeading } from './section-heading'
import { Divider } from './divider'

type Attendance = 'accept' | 'decline'

const fieldClass =
  'w-full rounded-lg border border-gold/25 bg-background/60 px-4 py-3 font-sans text-lg text-cream placeholder:text-muted-foreground/60 outline-none transition focus:border-gold focus:ring-1 focus:ring-gold/50'
const labelClass =
  'mb-2 block font-sans text-sm font-semibold uppercase tracking-[0.2em] text-gold'

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
      fullName: data.get('fullName'),
      email: data.get('email'),
      attendance,
      note: data.get('note'),
    }

    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j.error || 'Something went wrong.')
      }
      setStatus('success')
      form.reset()
    } catch (err) {
      setErrorMsg((err as Error).message)
      setStatus('error')
    }
  }

  return (
    <section className="relative bg-background px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-2xl">
        <SectionHeading subtitle={`Kindly Reply By ${wedding.rsvpBy}`} title="RSVP" />
        <Divider />

        <p className="mx-auto mt-4 max-w-lg text-center font-sans text-lg italic leading-relaxed text-muted-foreground">
          We hope you will join us on our special day. Please let us know if you can make it.
        </p>

        {status === 'success' ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-10 flex flex-col items-center rounded-2xl border border-gold/30 bg-card/60 p-12 text-center glow-gold"
          >
            <Heart className="size-10 text-gold" />
            <h3 className="font-heading mt-5 text-3xl text-cream">Thank You</h3>
            <p className="mt-3 max-w-sm font-sans text-lg leading-relaxed text-muted-foreground">
              Your RSVP has been received. We cannot wait to celebrate this beautiful
              day with you.
            </p>
          </motion.div>
        ) : (
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="mt-10 flex flex-col gap-6 rounded-2xl border border-gold/20 bg-card/40 p-8 backdrop-blur-sm sm:p-10"
          >
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="fullName" className={labelClass}>
                  Full Name
                </label>
                <input id="fullName" name="fullName" required placeholder="Your full name" className={fieldClass} />
              </div>

              <div>
                <label htmlFor="email" className={labelClass}>
                  Email Address
                </label>
                <input id="email" name="email" type="email" required placeholder="you@email.com" className={fieldClass} />
              </div>
            </div>

            <div>
              <span className={labelClass}>Will You Attend?</span>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAttendance('accept')}
                  className={`flex items-center justify-center gap-2 rounded-lg border px-4 py-3 font-sans text-lg transition ${
                    attendance === 'accept'
                      ? 'border-gold bg-gold/15 text-cream glow-gold'
                      : 'border-gold/25 text-muted-foreground hover:border-gold/50'
                  }`}
                >
                  <Check className="size-4 text-gold" /> Joyfully Accept
                </button>
                <button
                  type="button"
                  onClick={() => setAttendance('decline')}
                  className={`flex items-center justify-center gap-2 rounded-lg border px-4 py-3 font-sans text-lg transition ${
                    attendance === 'decline'
                      ? 'border-gold bg-gold/15 text-cream glow-gold'
                      : 'border-gold/25 text-muted-foreground hover:border-gold/50'
                  }`}
                >
                  <X className="size-4 text-gold" /> Regretfully Decline
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="note" className={labelClass}>
                A Note for the Couple (Optional)
              </label>
              <textarea
                id="note"
                name="note"
                rows={4}
                placeholder="Share your wishes..."
                className={`${fieldClass} resize-none`}
              />
            </div>

            {status === 'error' && (
              <p className="text-center font-sans text-base text-destructive">{errorMsg}</p>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="bg-gradient-gold mt-2 rounded-lg px-8 py-4 font-sans text-lg font-semibold uppercase tracking-[0.25em] text-background transition hover:brightness-110 disabled:opacity-60"
            >
              {status === 'loading' ? 'Sending...' : 'Send RSVP ✦'}
            </button>
          </motion.form>
        )}
      </div>
    </section>
  )
}