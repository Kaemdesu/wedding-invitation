'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Gift, Check, Copy, X, CreditCard, ExternalLink, Sparkles } from 'lucide-react'
import { useState, useEffect, useCallback } from 'react'
import { SectionHeading } from './section-heading'
import { Divider } from './divider'
import { fadeUp, staggerFast, viewportDefaults } from '@/lib/motion'
import type { PublicGift, ShopName } from '@/lib/supabase'

const SHOP_LABELS: Record<ShopName, string> = {
  tokopedia: 'Tokopedia',
  shopee: 'Shopee',
  lazada: 'Lazada',
  other: 'Visit Shop',
}

const SHOP_COLORS: Record<ShopName, string> = {
  tokopedia: 'text-emerald-300',
  shopee: 'text-orange-300',
  lazada: 'text-blue-300',
  other: 'text-gold',
}

function formatPrice(idr: number) {
  return `Rp ${idr.toLocaleString('id-ID')}`
}

export function GiftRegistry() {
  const [gifts, setGifts] = useState<PublicGift[]>([])
  const [loading, setLoading] = useState(true)
  const [modalGift, setModalGift] = useState<PublicGift | null>(null)
  const [guestName, setGuestName] = useState('')
  const [guestEmail, setGuestEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [reserveError, setReserveError] = useState('')
  const [copied, setCopied] = useState(false)

  /** Fetch gifts from API */
  const loadGifts = useCallback(async () => {
    try {
      const res = await fetch('/api/gifts', { cache: 'no-store' })
      const data = await res.json()
      setGifts(data.gifts || [])
    } catch {
      // Silent fail — user sees empty state
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadGifts()
  }, [loadGifts])

  /** Lock body scroll while modal is open */
  useEffect(() => {
    if (modalGift) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [modalGift])

  const handleReserve = useCallback(async () => {
    if (!modalGift || !guestName.trim()) return
    setSubmitting(true)
    setReserveError('')

    try {
      const res = await fetch('/api/gifts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          giftId: modalGift.id,
          guestName: guestName.trim(),
          guestEmail: guestEmail.trim() || undefined,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setReserveError(data.error || 'Failed to reserve gift. Please try again.')
        // Refresh gifts in case someone else just took it
        await loadGifts()
      } else {
        // Success — refresh and close
        await loadGifts()
        setModalGift(null)
        setGuestName('')
        setGuestEmail('')
      }
    } catch {
      setReserveError('Network error. Please try again.')
    }
    setSubmitting(false)
  }, [modalGift, guestName, guestEmail, loadGifts])

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
        Your presence is the greatest gift. However, if you wish to honor us with a
        gift, here are some items we would love.
      </motion.p>

      {/* Gift Cards Grid */}
      {loading ? (
        <div className="mx-auto grid max-w-6xl gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[3/4] animate-pulse rounded-2xl border border-gold/10 bg-card/20"
            />
          ))}
        </div>
      ) : gifts.length === 0 ? (
        <p className="mx-auto max-w-md text-center font-sans text-fluid-base italic text-cream/60">
          Gift registry coming soon. ✨
        </p>
      ) : (
        <motion.div
          variants={staggerFast}
          initial="hidden"
          whileInView="show"
          viewport={viewportDefaults}
          className="mx-auto grid max-w-6xl gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3"
        >
          {gifts.map((gift) => {
            const isAvailable = gift.status === 'available'
            const shopName = gift.shop_name || 'other'

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
    src={gift.image_url || '/placeholder.svg'}
    alt={gift.name}
    loading="lazy"
    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 gpu"
  />

                  {/* Status badge */}
                  {!isAvailable && (
                    <div className="absolute right-3 top-3 rounded-full border border-gold/40 bg-background/85 px-3 py-1 backdrop-blur-sm">
                      <span className="font-mono text-fluid-xs uppercase tracking-wider text-gold">
                        {gift.status === 'reserved' && 'Reserved'}
                        {gift.status === 'purchased' && 'Purchased'}
                        {gift.status === 'received' && '✦ Received'}
                      </span>
                    </div>
                  )}

                  {/* Shop badge */}
                  {gift.shop_name && (
                    <div className="absolute left-3 top-3 rounded-full border border-gold/30 bg-background/80 px-3 py-1 backdrop-blur-sm">
                      <span
                        className={`font-mono text-fluid-xs uppercase tracking-wider ${SHOP_COLORS[shopName]}`}
                      >
                        {SHOP_LABELS[shopName]}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-5 md:p-6">
                  <h3 className="font-heading text-fluid-xl font-light italic text-cream">
                    {gift.name}
                  </h3>

                  {gift.description && (
                    <p className="mt-2 font-sans text-fluid-sm leading-relaxed text-cream/65">
                      {gift.description}
                    </p>
                  )}

                  <p className="mt-3 font-mono text-fluid-sm tracking-wider text-gold">
                    {formatPrice(gift.price_idr)}
                  </p>

                  {/* Footer area: shop link + reserve button */}
                  <div className="mt-auto flex flex-col gap-2 pt-5">
                    {/* Shop link */}
                    {gift.shop_url && (
<a
  href={gift.shop_url}
  target="_blank"
  rel="noopener noreferrer"
  className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-gold/20 bg-background/30 px-3 py-2 font-mono text-fluid-xs uppercase tracking-wider text-cream/75 transition hover:border-gold/40 hover:text-cream"
>
  <ExternalLink className="h-3.5 w-3.5" />
  View at {SHOP_LABELS[shopName]}
</a>
                    )}

                    {/* Reserve / Reserved by */}
                    {!isAvailable ? (
                      <p className="rounded-lg border border-gold/15 bg-background/30 px-4 py-3 text-center font-sans text-fluid-sm italic text-cream/60">
                        {gift.reserved_by_name
                          ? `Reserved by ${gift.reserved_by_name}`
                          : 'Reserved ✦'}
                      </p>
                    ) : (
                      <button
                        onClick={() => setModalGift(gift)}
                        className="touch-target inline-flex items-center justify-center gap-2 rounded-lg border border-gold/40 bg-gold/10 px-4 py-3 font-mono text-fluid-xs font-semibold uppercase tracking-[0.2em] text-gold transition hover:border-gold hover:bg-gold/20"
                      >
                        <Gift className="h-4 w-4" /> Reserve This Gift
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      )}

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

      {/* Reservation Modal */}
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
              setGuestEmail('')
              setReserveError('')
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
                    setGuestEmail('')
                    setReserveError('')
                  }}
                  className="touch-target rounded-lg p-1 text-muted-foreground transition hover:text-cream"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <p className="mt-4 font-sans text-fluid-base leading-relaxed text-cream/80">
                You are reserving <span className="text-gold">{modalGift.name}</span> (
                {formatPrice(modalGift.price_idr)}).
              </p>

              <div className="mt-5 space-y-3">
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Your full name *"
                  maxLength={100}
                  className="touch-target w-full rounded-lg border border-gold/25 bg-background/60 px-4 py-3 font-sans text-fluid-base text-cream placeholder:text-muted-foreground/60 outline-none transition focus:border-gold focus:ring-1 focus:ring-gold/50"
                  autoFocus
                  disabled={submitting}
                />
                <input
                  type="email"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  placeholder="Email (optional, for updates)"
                  maxLength={150}
                  className="touch-target w-full rounded-lg border border-gold/25 bg-background/60 px-4 py-3 font-sans text-fluid-base text-cream placeholder:text-muted-foreground/60 outline-none transition focus:border-gold focus:ring-1 focus:ring-gold/50"
                  disabled={submitting}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && guestName.trim()) handleReserve()
                  }}
                />
              </div>

              {reserveError && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-center font-sans text-fluid-sm text-destructive"
                >
                  {reserveError}
                </motion.p>
              )}

              <p className="mt-4 flex items-start gap-2 font-sans text-fluid-xs italic text-cream/55">
                <Sparkles className="mt-0.5 h-3 w-3 shrink-0 text-gold/70" />
                After reserving, you can purchase the gift at your convenience using the
                shop link. Kelvin & Annisa will be notified.
              </p>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => {
                    setModalGift(null)
                    setGuestName('')
                    setGuestEmail('')
                    setReserveError('')
                  }}
                  disabled={submitting}
                  className="touch-target flex-1 rounded-lg border border-gold/25 px-4 py-3 font-mono text-fluid-xs uppercase tracking-[0.2em] text-muted-foreground transition hover:border-gold/50 hover:text-cream disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReserve}
                  disabled={!guestName.trim() || submitting}
                  className="touch-target flex-1 rounded-lg bg-gradient-gold px-4 py-3 font-mono text-fluid-xs font-semibold uppercase tracking-[0.2em] text-background transition disabled:cursor-not-allowed disabled:opacity-50"
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