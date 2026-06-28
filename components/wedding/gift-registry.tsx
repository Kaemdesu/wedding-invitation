'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Gift, Check, Copy, X, CreditCard } from 'lucide-react'
import { useState, useEffect, useCallback } from 'react'
import { SectionHeading } from './section-heading'
import { Divider } from './divider'
import { fadeUp, staggerFast, viewportDefaults } from '@/lib/motion'

interface GiftItem {
  id: string
  name: string
  price: string
  image: string
}

const gifts: GiftItem[] = [
  { id: 'gift-1', name: 'Coffee Machine', price: 'Rp 2.500.000', image: '/placeholder.svg' },
  { id: 'gift-2', name: 'Luxury Dinnerware Set', price: 'Rp 3.000.000', image: '/placeholder.svg' },
  { id: 'gift-3', name: 'Travel Luggage Set', price: 'Rp 4.500.000', image: '/placeholder.svg' },
  { id: 'gift-4', name: 'Stand Mixer', price: 'Rp 3.500.000', image: '/placeholder.svg' },
  { id: 'gift-5', name: 'Smart Home Speaker', price: 'Rp 1.800.000', image: '/placeholder.svg' },
]

export function GiftRegistry() {
  const [reservations, setReservations] = useState<Record<string, string>>({})
  const [modalGift, setModalGift] = useState<GiftItem | null>(null)
  const [guestName, setGuestName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetch('/api/gifts')
      .then((res) => res.json())
      .then((data) => setReservations(data))
      .catch(() => {})
  }, [])

  // Lock body scroll while modal is open
  useEffect(() => {
    if (modalGift) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [modalGift])

  const handleReserve = useCallback(async () => {
    if (!modalGift || !guestName.trim()) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/gifts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ giftId: modalGift.id, guestName: guestName.trim() }),
      })
      if (res.ok) {
        const data = await res.json()
        setReservations(data.reservations)
      } else {
        const fresh = await fetch('/api/gifts').then((r) => r.json())
        setReservations(fresh)
      }
    } catch {
      setReservations((prev) => ({ ...prev, [modalGift.id]: guestName.trim() }))
    }
    setSubmitting(false)
    setModalGift(null)
    setGuestName('')
  }, [modalGift, guestName])

  const copyAccount = useCallback(() => {
    navigator.clipboard.writeText('5215143209')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [])

  return (
    <section className="relative px-6 py-24 safe-x md:py-32">
      <SectionHeading subtitle="Gift Registry" title="With love & gratitude" />

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewportDefaults}
        transition={{ duration: 0.8 }}
        className="mx-auto mb-12 max-w-2xl text-center font-sans text-fluid-base text-cream/80 md:mb-16"
      >
        Your presence is the greatest gift. However, if you wish to honor us with a gift,
        here are some items we would love.
      </motion.p>

      {/* Gift Cards Grid */}
      <motion.div
        variants={staggerFast}
        initial="hidden"
        whileInView="show"
        viewport={viewportDefaults}
        className="mx-auto grid max-w-6xl gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3"
      >
        {gifts.map((gift) => {
          const reservedBy = reservations[gift.id]
          return (
            <motion.div
              key={gift.id}
              variants={fadeUp}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="group flex flex-col overflow-hidden rounded-2xl border border-gold/20 bg-card/40 backdrop-blur-sm"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={gift.image}
                  alt={gift.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 gpu"
                />
                {reservedBy && (
                  <div className="absolute right-3 top-3 rounded-full border border-gold/40 bg-background/85 px-3 py-1 backdrop-blur-sm">
                    <span className="font-mono text-fluid-xs uppercase tracking-wider text-gold">
                      Reserved
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-1 flex-col p-5 md:p-6">
                <h3 className="font-heading text-fluid-xl font-light italic text-cream">
                  {gift.name}
                </h3>
                <p className="mt-2 font-mono text-fluid-sm tracking-wider text-gold">
                  {gift.price}
                </p>

                {reservedBy ? (
                  <p className="mt-auto pt-4 font-sans text-fluid-sm italic text-cream/65">
                    Reserved by {reservedBy}
                  </p>
                ) : (
                  <button
                    onClick={() => setModalGift(gift)}
                    className="touch-target mt-auto inline-flex items-center justify-center gap-2 rounded-lg border border-gold/30 px-4 py-3 font-mono text-fluid-xs uppercase tracking-[0.2em] text-gold transition hover:border-gold hover:bg-gold/10"
                  >
                    <Gift className="h-4 w-4" /> Reserve This Gift
                  </button>
                )}
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Monetary Gift */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewportDefaults}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto mt-12 max-w-2xl rounded-2xl border border-gold/20 bg-card/40 p-6 backdrop-blur-sm md:mt-16 md:p-10"
      >
        <div className="mb-5 flex items-center gap-3">
          <CreditCard className="h-5 w-5 text-gold" />
          <h3 className="font-heading text-fluid-xl font-light italic text-cream">
            Monetary Gift
          </h3>
        </div>

        <p className="font-sans text-fluid-base leading-relaxed text-cream/80">
          For those who prefer to give a monetary gift, you may transfer to the account
          below.
        </p>

        <div className="mt-6 rounded-xl border border-gold/20 bg-background/40 p-5">
          <p className="font-mono text-fluid-xs uppercase tracking-[0.25em] text-gold/80">
            Bank Central Asia
          </p>
          <div className="mt-3 flex items-center gap-3">
            <p className="font-mono text-fluid-xl tracking-wider text-cream">5215143209</p>
            <button
              onClick={copyAccount}
              className="touch-target inline-flex items-center justify-center rounded-lg border border-gold/30 p-2 text-gold transition hover:border-gold hover:bg-gold/10"
              aria-label="Copy account number"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </button>
            {copied && (
              <span className="font-mono text-fluid-xs uppercase tracking-wider text-gold">
                Copied!
              </span>
            )}
          </div>
          <p className="mt-3 font-sans text-fluid-sm text-cream/70">a.n. Kelvin Muliawan</p>
        </div>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {modalGift && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => {
              setModalGift(null)
              setGuestName('')
            }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-background/85 p-4 backdrop-blur-md sm:items-center safe-bottom"
          >
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.96 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl border border-gold/30 bg-background p-6 md:p-8"
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-heading text-fluid-2xl font-light italic text-gradient-gold">
                  Reserve Gift
                </h3>
                <button
                  onClick={() => {
                    setModalGift(null)
                    setGuestName('')
                  }}
                  className="touch-target rounded-lg p-1 text-muted-foreground transition hover:text-cream"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <p className="mt-4 font-sans text-fluid-base leading-relaxed text-cream/80">
                You are reserving <span className="text-gold">{modalGift.name}</span> (
                {modalGift.price}). Please enter your name to confirm.
              </p>

              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Your full name"
                className="touch-target mt-5 w-full rounded-lg border border-gold/25 bg-background/60 px-4 py-3 font-sans text-fluid-base text-cream placeholder:text-muted-foreground/60 outline-none transition focus:border-gold focus:ring-1 focus:ring-gold/50"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && guestName.trim()) handleReserve()
                }}
              />

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => {
                    setModalGift(null)
                    setGuestName('')
                  }}
                  className="touch-target flex-1 rounded-lg border border-gold/25 px-4 py-3 font-mono text-fluid-xs uppercase tracking-[0.2em] text-muted-foreground transition hover:border-gold/50 hover:text-cream"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReserve}
                  disabled={!guestName.trim() || submitting}
                  className="touch-target flex-1 rounded-lg bg-gradient-gold px-4 py-3 font-mono text-fluid-xs font-semibold uppercase tracking-[0.2em] text-background transition disabled:opacity-50"
                >
                  {submitting ? 'Reserving...' : 'Confirm'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Divider />
    </section>
  )
}
