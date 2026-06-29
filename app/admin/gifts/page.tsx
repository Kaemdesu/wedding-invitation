'use client'

import { useCallback, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { LogOut, RefreshCw, Lock, Check, RotateCcw, ShoppingBag, Gift as GiftIcon } from 'lucide-react'
import type { Gift, GiftStatus } from '@/lib/supabase'

const PIN_STORAGE_KEY = 'wedding-admin-pin'

function formatPrice(idr: number) {
  return `Rp ${idr.toLocaleString('id-ID')}`
}

function StatusBadge({ status }: { status: GiftStatus }) {
  const map: Record<GiftStatus, { label: string; color: string }> = {
    available: { label: 'Available', color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' },
    reserved: { label: 'Reserved', color: 'bg-amber-500/15 text-amber-300 border-amber-500/30' },
    purchased: { label: 'Purchased', color: 'bg-blue-500/15 text-blue-300 border-blue-500/30' },
    received: { label: 'Received', color: 'bg-violet-500/15 text-violet-300 border-violet-500/30' },
  }
  const { label, color } = map[status]
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 font-mono text-xs uppercase tracking-wider ${color}`}
    >
      {label}
    </span>
  )
}

export default function AdminGiftsPage() {
  const [pin, setPin] = useState('')
  const [authed, setAuthed] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [gifts, setGifts] = useState<Gift[]>([])
  const [loading, setLoading] = useState(false)

  /** Try restoring PIN from sessionStorage */
  useEffect(() => {
    const saved = sessionStorage.getItem(PIN_STORAGE_KEY)
    if (saved) {
      setPin(saved)
      verifyAndLoad(saved)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const verifyAndLoad = useCallback(async (pinToUse: string) => {
    setLoading(true)
    setLoginError('')
    try {
      const res = await fetch('/api/admin/gifts', {
        headers: { 'x-admin-pin': pinToUse },
      })
      if (res.status === 401) {
        setLoginError('Invalid PIN')
        sessionStorage.removeItem(PIN_STORAGE_KEY)
        setAuthed(false)
      } else if (!res.ok) {
        setLoginError('Failed to load gifts')
      } else {
        const data = await res.json()
        setGifts(data.gifts || [])
        setAuthed(true)
        sessionStorage.setItem(PIN_STORAGE_KEY, pinToUse)
      }
    } catch {
      setLoginError('Network error')
    }
    setLoading(false)
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (pin.length >= 4) verifyAndLoad(pin)
  }

  const handleLogout = () => {
    sessionStorage.removeItem(PIN_STORAGE_KEY)
    setPin('')
    setAuthed(false)
    setGifts([])
  }

  const updateGift = useCallback(
    async (giftId: string, updates: { status?: GiftStatus; clearReservation?: boolean }) => {
      try {
        const res = await fetch('/api/admin/gifts', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', 'x-admin-pin': pin },
          body: JSON.stringify({ giftId, ...updates }),
        })
        if (!res.ok) throw new Error('Update failed')
        const data = await res.json()
        setGifts((prev) => prev.map((g) => (g.id === giftId ? data.gift : g)))
      } catch {
        alert('Update failed. Please try again.')
      }
    },
    [pin]
  )

  /** Login screen */
  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm rounded-2xl border border-gold/20 bg-card/40 p-8 backdrop-blur-sm"
        >
          <div className="mb-6 flex items-center gap-3">
            <Lock className="h-5 w-5 text-gold" />
            <h1 className="font-heading text-2xl font-light italic text-gradient-gold">
              Admin Access
            </h1>
          </div>
          <p className="mb-6 font-sans text-sm text-cream/70">
            Enter your PIN to manage the gift registry.
          </p>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              inputMode="numeric"
              autoComplete="off"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
              placeholder="••••••"
              maxLength={10}
              className="w-full rounded-lg border border-gold/25 bg-background/60 px-4 py-3 text-center font-mono text-2xl tracking-[0.5em] text-cream outline-none focus:border-gold focus:ring-1 focus:ring-gold/50"
              autoFocus
            />
            {loginError && (
              <p className="mt-3 text-center font-sans text-sm text-destructive">
                {loginError}
              </p>
            )}
            <button
              type="submit"
              disabled={pin.length < 4 || loading}
              className="mt-6 w-full rounded-lg bg-gradient-gold px-4 py-3 font-mono text-xs font-semibold uppercase tracking-[0.25em] text-background transition disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Unlock'}
            </button>
          </form>
        </motion.div>
      </div>
    )
  }

  /** Stats */
  const stats = {
    total: gifts.length,
    available: gifts.filter((g) => g.status === 'available').length,
    reserved: gifts.filter((g) => g.status === 'reserved').length,
    purchased: gifts.filter((g) => g.status === 'purchased').length,
    received: gifts.filter((g) => g.status === 'received').length,
  }

  return (
    <div className="min-h-screen px-4 py-8 md:px-8">
      {/* Header */}
      <div className="mx-auto mb-8 flex max-w-6xl items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-light italic text-gradient-gold md:text-4xl">
            Gift Registry Admin
          </h1>
          <p className="mt-1 font-sans text-sm text-cream/60">
            Manage reservations & status
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => verifyAndLoad(pin)}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg border border-gold/25 px-3 py-2 font-mono text-xs text-cream/70 transition hover:border-gold/50 hover:text-cream disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-lg border border-destructive/30 px-3 py-2 font-mono text-xs text-destructive/80 transition hover:border-destructive/60 hover:text-destructive"
          >
            <LogOut className="h-3.5 w-3.5" />
            Logout
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="mx-auto mb-8 grid max-w-6xl grid-cols-2 gap-3 md:grid-cols-5">
        {[
          { label: 'Total', value: stats.total, color: 'text-cream' },
          { label: 'Available', value: stats.available, color: 'text-emerald-300' },
          { label: 'Reserved', value: stats.reserved, color: 'text-amber-300' },
          { label: 'Purchased', value: stats.purchased, color: 'text-blue-300' },
          { label: 'Received', value: stats.received, color: 'text-violet-300' },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            className="rounded-xl border border-gold/15 bg-card/30 p-4 backdrop-blur-sm"
          >
            <p className="font-mono text-xs uppercase tracking-wider text-cream/60">
              {label}
            </p>
            <p className={`mt-1 font-heading text-2xl font-light ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Gifts table */}
      <div className="mx-auto max-w-6xl space-y-3">
        {gifts.length === 0 ? (
          <p className="py-12 text-center font-sans text-cream/60">No gifts found.</p>
        ) : (
          gifts.map((gift) => (
            <div
              key={gift.id}
              className="rounded-2xl border border-gold/20 bg-card/30 p-4 backdrop-blur-sm md:p-6"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-heading text-lg font-light italic text-cream md:text-xl">
                      {gift.name}
                    </h3>
                    <StatusBadge status={gift.status} />
                  </div>
                  <p className="mt-1 font-mono text-sm text-gold">
                    {formatPrice(gift.price_idr)}
                  </p>
                  {gift.reserved_by_name && (
                    <div className="mt-3 rounded-lg border border-gold/15 bg-background/30 p-3 text-sm">
                      <p className="text-cream/85">
                        <span className="font-semibold text-gold">Reserved by:</span>{' '}
                        {gift.reserved_by_name}
                      </p>
                      {gift.reserved_by_email && (
                        <p className="mt-1 text-cream/65">{gift.reserved_by_email}</p>
                      )}
                      {gift.reserved_at && (
                        <p className="mt-1 font-mono text-xs text-cream/50">
                          {new Date(gift.reserved_at).toLocaleString('id-ID', {
                            timeZone: 'Asia/Jakarta',
                            dateStyle: 'medium',
                            timeStyle: 'short',
                          })}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  {gift.status === 'reserved' && (
                    <button
                      onClick={() => updateGift(gift.id, { status: 'purchased' })}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-blue-500/30 bg-blue-500/10 px-3 py-2 font-mono text-xs uppercase tracking-wider text-blue-300 transition hover:bg-blue-500/20"
                    >
                      <ShoppingBag className="h-3.5 w-3.5" />
                      Mark Purchased
                    </button>
                  )}
                  {(gift.status === 'reserved' || gift.status === 'purchased') && (
                    <button
                      onClick={() => updateGift(gift.id, { status: 'received' })}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-violet-500/30 bg-violet-500/10 px-3 py-2 font-mono text-xs uppercase tracking-wider text-violet-300 transition hover:bg-violet-500/20"
                    >
                      <GiftIcon className="h-3.5 w-3.5" />
                      Mark Received
                    </button>
                  )}
                  {(gift.status === 'reserved' ||
                    gift.status === 'purchased' ||
                    gift.status === 'received') && (
                    <button
                      onClick={() => {
                        if (confirm(`Release reservation for "${gift.name}"?`))
                          updateGift(gift.id, { clearReservation: true })
                      }}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 font-mono text-xs uppercase tracking-wider text-destructive/90 transition hover:bg-destructive/20"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      Release
                    </button>
                  )}
                  {gift.status === 'available' && (
                    <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2">
                      <Check className="h-3.5 w-3.5 text-emerald-300" />
                      <span className="font-mono text-xs uppercase tracking-wider text-emerald-300">
                        Open for guests
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}