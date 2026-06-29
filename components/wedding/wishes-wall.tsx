'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Pin, Sparkles, Send, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { SectionHeading } from './section-heading'
import { Divider } from './divider'
import { fadeUp, viewportDefaults, easeLuxury } from '@/lib/motion'
import type { PublicWish } from '@/lib/supabase'

const PER_PAGE = 6 // wishes shown per "page" in carousel
const AUTO_ROTATE_MS = 7000 // how often pages rotate (7s)

function timeAgo(iso: string): string {
  const now = Date.now()
  const then = new Date(iso).getTime()
  const sec = Math.floor((now - then) / 1000)
  if (sec < 60) return 'just now'
  const min = Math.floor(sec / 60)
  if (min < 60) return `${min}m ago`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr}h ago`
  const day = Math.floor(hr / 24)
  if (day < 7) return `${day}d ago`
  return new Date(iso).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
  })
}

function firstName(full: string): string {
  return full.trim().split(/\s+/)[0]
}

function WishCard({ wish }: { wish: PublicWish }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: -8 }}
      transition={{ duration: 0.55, ease: easeLuxury }}
      className={`group relative break-inside-avoid rounded-2xl border bg-card/40 p-5 backdrop-blur-sm md:p-6 ${
        wish.is_pinned ? 'border-gold/40 bg-gold/[0.04]' : 'border-gold/15'
      }`}
    >
      {wish.is_pinned && (
        <div className="absolute -top-3 left-5 flex items-center gap-1.5 rounded-full border border-gold/40 bg-background px-3 py-1 backdrop-blur-sm">
          <Pin className="h-3 w-3 text-gold" />
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold">
            Pinned
          </span>
        </div>
      )}
      <div className="absolute -top-2 right-3 font-heading text-fluid-3xl font-light italic leading-none text-gold/15">
        ❝
      </div>
      <p className="relative font-sans text-fluid-base leading-relaxed text-cream/90 [overflow-wrap:break-word]">
        {wish.message}
      </p>
      <div className="mt-4 flex items-center justify-between gap-3 border-t border-gold/10 pt-3">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-gold font-mono text-xs font-semibold text-background">
            {firstName(wish.name).charAt(0).toUpperCase()}
          </div>
          <p className="truncate font-heading text-fluid-base font-light italic text-gradient-gold">
            {firstName(wish.name)}
          </p>
        </div>
        <p className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-cream/40">
          {timeAgo(wish.created_at)}
        </p>
      </div>
    </motion.div>
  )
}

export function WishesWall() {
  const [wishes, setWishes] = useState<PublicWish[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [paused, setPaused] = useState(false)

  // Form state
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  /** Fetch all wishes once (cap at 100 for performance) */
  const loadAll = useCallback(async () => {
    try {
      const res = await fetch('/api/wishes?limit=100&offset=0', { cache: 'no-store' })
      const data = await res.json()
      setWishes(data.wishes || [])
      setTotal(data.total || 0)
    } catch {
      // Silent fail
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadAll()
  }, [loadAll])

  /** Real-time subscription */
  useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!supabaseUrl || !supabaseAnonKey) return

    const client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false },
    })

    const channel = client
      .channel('wishes-feed')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'wishes', filter: 'is_hidden=eq.false' },
        (payload) => {
          const newWish = payload.new as PublicWish
          setWishes((prev) => {
            if (prev.some((w) => w.id === newWish.id)) return prev
            return [newWish, ...prev]
          })
          setTotal((t) => t + 1)
          // Bounce back to first page so guests see it
          setPage(0)
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'wishes' },
        (payload) => {
          const updated = payload.new as PublicWish & { is_hidden: boolean }
          if (updated.is_hidden) {
            setWishes((prev) => prev.filter((w) => w.id !== updated.id))
            setTotal((t) => Math.max(0, t - 1))
          } else {
            setWishes((prev) =>
              prev.map((w) => (w.id === updated.id ? { ...w, ...updated } : w))
            )
          }
        }
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'wishes' },
        (payload) => {
          const deletedId = (payload.old as { id?: string }).id
          if (deletedId) {
            setWishes((prev) => prev.filter((w) => w.id !== deletedId))
            setTotal((t) => Math.max(0, t - 1))
          }
        }
      )
      .subscribe()

    return () => {
      client.removeChannel(channel)
    }
  }, [])

  // Sort: pinned first, then newest
  const sortedWishes = useMemo(() => {
    return [...wishes].sort((a, b) => {
      if (a.is_pinned && !b.is_pinned) return -1
      if (!a.is_pinned && b.is_pinned) return 1
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })
  }, [wishes])

  const totalPages = Math.max(1, Math.ceil(sortedWishes.length / PER_PAGE))
  const safePage = Math.min(page, totalPages - 1)
  const currentPageWishes = sortedWishes.slice(
    safePage * PER_PAGE,
    safePage * PER_PAGE + PER_PAGE
  )

  /** Auto-rotate */
  useEffect(() => {
    if (paused || totalPages <= 1) return
    const interval = setInterval(() => {
      setPage((p) => (p + 1) % totalPages)
    }, AUTO_ROTATE_MS)
    return () => clearInterval(interval)
  }, [paused, totalPages])

  // Reset to page 0 if total pages shrinks
  useEffect(() => {
    if (page >= totalPages) setPage(0)
  }, [page, totalPages])

  const goPrev = () => setPage((p) => (p - 1 + totalPages) % totalPages)
  const goNext = () => setPage((p) => (p + 1) % totalPages)

  /** Submit handler */
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (submitting) return
    setSubmitting(true)
    setStatus('idle')
    setErrorMsg('')

    try {
      const res = await fetch('/api/wishes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, message }),
      })
      const data = await res.json()
      if (!res.ok) {
        setErrorMsg(data.error || 'Failed to send wish. Please try again.')
        setStatus('error')
      } else {
        if (data.wish) {
          setWishes((prev) => {
            if (prev.some((w) => w.id === data.wish.id)) return prev
            return [data.wish, ...prev]
          })
          setTotal((t) => t + 1)
          setPage(0)
        }
        setStatus('success')
        setName('')
        setMessage('')
        setTimeout(() => setStatus('idle'), 4000)
      }
    } catch {
      setErrorMsg('Network error. Please try again.')
      setStatus('error')
    }
    setSubmitting(false)
  }

  return (
    <section className="relative px-6 py-24 safe-x md:py-32">
      <SectionHeading subtitle="Words of love" title="Wishes from those we love" />

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewportDefaults}
        transition={{ duration: 0.8 }}
        className="mx-auto mb-10 max-w-2xl text-center font-sans text-fluid-base italic text-cream/80 md:mb-14"
      >
        Whether you&apos;ll be there in person or in spirit, leave us a note from
        the heart. ✨
      </motion.p>

      <div className="mx-auto max-w-6xl">
        {loading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-40 animate-pulse rounded-2xl border border-gold/10 bg-card/20"
              />
            ))}
          </div>
        ) : sortedWishes.length === 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-12 text-center font-sans text-fluid-base italic text-cream/60"
          >
            Be the first to leave a wish ✨
          </motion.p>
        ) : (
          <div
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onTouchStart={() => setPaused(true)}
          >
            {/* Carousel — animated page transition */}
            <div className="relative min-h-[500px] md:min-h-[420px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={safePage}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -24 }}
                  transition={{ duration: 0.5, ease: easeLuxury }}
                  className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3"
                >
                  {currentPageWishes.map((wish) => (
                    <WishCard key={wish.id} wish={wish} />
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Controls */}
            {totalPages > 1 && (
              <div className="mt-8 flex flex-col items-center gap-4 md:mt-10">
                {/* Page dots */}
                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i)}
                      aria-label={`Go to page ${i + 1}`}
                      className={`h-1.5 rounded-full transition-all ${
                        i === safePage
                          ? 'w-8 bg-gold'
                          : 'w-1.5 bg-gold/30 hover:bg-gold/60'
                      }`}
                    />
                  ))}
                </div>

                {/* Arrow + pause controls */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={goPrev}
                    aria-label="Previous wishes"
                    className="touch-target inline-flex items-center justify-center rounded-full border border-gold/25 bg-card/30 p-2 text-gold/80 transition hover:border-gold hover:text-gold"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setPaused((p) => !p)}
                    aria-label={paused ? 'Resume rotation' : 'Pause rotation'}
                    className="touch-target inline-flex items-center justify-center rounded-full border border-gold/25 bg-card/30 p-2 text-gold/80 transition hover:border-gold hover:text-gold"
                  >
                    {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={goNext}
                    aria-label="Next wishes"
                    className="touch-target inline-flex items-center justify-center rounded-full border border-gold/25 bg-card/30 p-2 text-gold/80 transition hover:border-gold hover:text-gold"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Stats line */}
        {!loading && sortedWishes.length > 0 && (
          <p className="mt-6 text-center font-mono text-fluid-xs uppercase tracking-[0.3em] text-cream/50 md:mt-8">
            <Heart className="mr-1 inline h-3 w-3 text-gold/70" /> {total}{' '}
            {total === 1 ? 'wish' : 'wishes'} from loved ones
          </p>
        )}

        {/* Submission form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportDefaults}
          transition={{ duration: 0.9, ease: easeLuxury }}
          className="mx-auto mt-16 max-w-xl rounded-2xl border border-gold/25 bg-card/40 p-6 backdrop-blur-sm sm:p-8 md:mt-20 md:p-10"
        >
          <div className="mb-5 flex items-center gap-3">
            <Sparkles className="h-4 w-4 text-gold" />
            <p className="font-mono text-fluid-xs uppercase tracking-[0.3em] text-gold">
              Leave your wishes
            </p>
          </div>

          {status === 'success' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: easeLuxury }}
              className="py-4 text-center"
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-gold/40 bg-gold/10">
                <Heart className="h-6 w-6 text-gold" />
              </div>
              <p className="font-heading text-fluid-xl font-light italic text-gradient-gold">
                Thank you for your kind words
              </p>
              <p className="mt-2 font-sans text-fluid-sm text-cream/75">
                Your wish has been added to the wall ✨
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block font-mono text-fluid-xs uppercase tracking-[0.2em] text-gold">
                  Your name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  maxLength={60}
                  placeholder="e.g., Maria"
                  disabled={submitting}
                  className="touch-target w-full rounded-lg border border-gold/25 bg-background/60 px-4 py-3 font-sans text-fluid-base text-cream placeholder:text-muted-foreground/50 outline-none transition focus:border-gold focus:ring-1 focus:ring-gold/50"
                />
              </div>

              <div>
                <label className="mb-1.5 block font-mono text-fluid-xs uppercase tracking-[0.2em] text-gold">
                  Your wish
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={4}
                  maxLength={500}
                  placeholder="A wish, prayer, or memory you'd love to share with Kelvin & Annisa..."
                  disabled={submitting}
                  className="touch-target w-full resize-none rounded-lg border border-gold/25 bg-background/60 px-4 py-3 font-sans text-fluid-base text-cream placeholder:text-muted-foreground/50 outline-none transition focus:border-gold focus:ring-1 focus:ring-gold/50"
                />
                <p className="mt-1 text-right font-mono text-fluid-xs text-cream/40">
                  {message.length} / 500
                </p>
              </div>

              {status === 'error' && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-center font-sans text-fluid-sm text-destructive"
                >
                  {errorMsg}
                </motion.p>
              )}

              <button
                type="submit"
                disabled={submitting || !name.trim() || !message.trim()}
                className="touch-target inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-gold px-6 py-4 font-mono text-fluid-sm font-semibold uppercase tracking-[0.25em] text-background transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
                {submitting ? 'Sending...' : 'Send Wish ✦'}
              </button>
            </form>
          )}
        </motion.div>
      </div>

      <Divider />
    </section>
  )
}