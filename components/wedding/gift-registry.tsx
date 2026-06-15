'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Gift, Check, Copy, X, CreditCard } from 'lucide-react'
import { useState, useEffect, useCallback } from 'react'
import { SectionHeading } from './section-heading'
import { Divider } from './divider'

interface GiftItem {
  id: string
  name: string
  price: string
  image: string
}

const gifts: GiftItem[] = [
  {
    id: 'gift-1',
    name: 'Coffee Machine',
    price: 'Rp 2.500.000',
    image: '/placeholder.svg',
  },
  {
    id: 'gift-2',
    name: 'Luxury Dinnerware Set',
    price: 'Rp 3.000.000',
    image: '/placeholder.svg',
  },
  {
    id: 'gift-3',
    name: 'Travel Luggage Set',
    price: 'Rp 4.500.000',
    image: '/placeholder.svg',
  },
  {
    id: 'gift-4',
    name: 'Stand Mixer',
    price: 'Rp 3.500.000',
    image: '/placeholder.svg',
  },
  {
    id: 'gift-5',
    name: 'Smart Home Speaker',
    price: 'Rp 1.800.000',
    image: '/placeholder.svg',
  },
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
    <section className="relative bg-background px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl">
        <SectionHeading subtitle="With Love" title="Gift Registry" />
        <Divider />

        <p className="mx-auto mt-6 max-w-2xl text-center font-sans text-lg italic leading-relaxed text-muted-foreground">
          Your presence is the greatest gift. However, if you wish to honor us
          with a gift, here are some items we would love.
        </p>

        {/* Gift Cards Grid */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {gifts.map((gift, i) => {
            const reservedBy = reservations[gift.id]

            return (
              <motion.div
                key={gift.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className={`group relative flex flex-col overflow-hidden rounded-2xl border bg-card/40 backdrop-blur-sm transition-all duration-300 ${
                  reservedBy
                    ? 'border-gold/10 opacity-70'
                    : 'border-gold/20 hover:border-gold/40 hover:scale-[1.02]'
                }`}
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-background/40">
                  <img
                    src={gift.image}
                    alt={gift.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {reservedBy && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/70">
                      <div className="flex flex-col items-center gap-1">
                        <Check className="size-8 text-gold" />
                        <span className="font-sans text-sm font-semibold text-gold">
                          Reserved
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-heading text-xl text-cream">{gift.name}</h3>
                  <p className="mt-1 font-sans text-base text-gold">{gift.price}</p>

                  {reservedBy ? (
                    <p className="mt-auto pt-4 font-sans text-sm italic text-muted-foreground">
                      Reserved by {reservedBy}
                    </p>
                  ) : (
                    <button
                      onClick={() => setModalGift(gift)}
                      className="mt-auto pt-4"
                    >
                      <span className="inline-flex items-center gap-2 rounded-lg border border-gold/30 px-5 py-2.5 font-sans text-sm font-semibold uppercase tracking-[0.15em] text-gold transition hover:bg-gold/10 hover:border-gold/50">
                        <Gift className="size-4" /> Reserve This Gift
                      </span>
                    </button>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Monetary Gift Section */}
        <div className="mt-20">
          <h3 className="text-center font-heading text-3xl text-cream">
            Monetary Gift
          </h3>
          <p className="mx-auto mt-3 max-w-lg text-center font-sans text-lg italic leading-relaxed text-muted-foreground">
            For those who prefer to give a monetary gift, you may transfer to the
            account below.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto mt-8 max-w-md rounded-2xl border border-gold/30 bg-card/40 p-8 text-center backdrop-blur-sm"
          >
            <div className="flex items-center justify-center gap-2">
              <CreditCard className="size-5 text-gold" />
              <span className="font-sans text-lg font-bold uppercase tracking-[0.2em] text-gold">
                BCA
              </span>
            </div>
            <p className="mt-1 font-sans text-sm text-muted-foreground">
              Bank Central Asia
            </p>

            <div className="mt-5 flex items-center justify-center gap-3">
              <span className="font-mono text-2xl tracking-[0.15em] text-cream">
                5215143209
              </span>
              <button
                onClick={copyAccount}
                className="rounded-lg border border-gold/30 p-2 transition hover:bg-gold/10"
                title="Copy account number"
              >
                {copied ? (
                  <Check className="size-4 text-gold" />
                ) : (
                  <Copy className="size-4 text-gold" />
                )}
              </button>
            </div>

            {copied && (
              <motion.p
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 font-sans text-sm text-gold"
              >
                Copied!
              </motion.p>
            )}

            <p className="mt-4 font-sans text-lg font-medium text-cream">
              Kelvin Muliawan
            </p>
          </motion.div>
        </div>
      </div>

      {/* Reservation Modal */}
      <AnimatePresence>
        {modalGift && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6 backdrop-blur-sm"
            onClick={() => {
              setModalGift(null)
              setGuestName('')
            }}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl border border-gold/30 bg-background p-8"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-heading text-2xl text-cream">Reserve Gift</h3>
                <button
                  onClick={() => {
                    setModalGift(null)
                    setGuestName('')
                  }}
                  className="rounded-lg p-1 text-muted-foreground transition hover:text-cream"
                >
                  <X className="size-5" />
                </button>
              </div>

              <p className="mt-3 font-sans text-base leading-relaxed text-muted-foreground">
                You are reserving{' '}
                <span className="font-semibold text-gold">{modalGift.name}</span>{' '}
                ({modalGift.price}). Please enter your name to confirm.
              </p>

              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Your full name"
                className="mt-5 w-full rounded-lg border border-gold/25 bg-background/60 px-4 py-3 font-sans text-lg text-cream placeholder:text-muted-foreground/60 outline-none transition focus:border-gold focus:ring-1 focus:ring-gold/50"
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
                  className="flex-1 rounded-lg border border-gold/25 px-4 py-3 font-sans text-base text-muted-foreground transition hover:border-gold/50 hover:text-cream"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReserve}
                  disabled={!guestName.trim() || submitting}
                  className="bg-gradient-gold flex-1 rounded-lg px-4 py-3 font-sans text-base font-semibold uppercase tracking-[0.15em] text-background transition hover:brightness-110 disabled:opacity-50"
                >
                  {submitting ? 'Reserving...' : 'Confirm'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}