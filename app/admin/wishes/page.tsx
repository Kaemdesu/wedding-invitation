'use client'

import { useCallback, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { LogOut, RefreshCw, Lock, Pin, PinOff, EyeOff, Eye, Trash2 } from 'lucide-react'
import type { Wish } from '@/lib/supabase'

const PIN_STORAGE_KEY = 'wedding-admin-pin'

function timeAgo(iso: string): string {
  return new Date(iso).toLocaleString('id-ID', {
    timeZone: 'Asia/Jakarta',
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

export default function AdminWishesPage() {
  const [pin, setPin] = useState('')
  const [authed, setAuthed] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [wishes, setWishes] = useState<Wish[]>([])
  const [loading, setLoading] = useState(false)

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
      const res = await fetch('/api/admin/wishes', {
        headers: { 'x-admin-pin': pinToUse },
      })
      if (res.status === 401) {
        setLoginError('Invalid PIN')
        sessionStorage.removeItem(PIN_STORAGE_KEY)
        setAuthed(false)
      } else if (!res.ok) {
        setLoginError('Failed to load wishes')
      } else {
        const data = await res.json()
        setWishes(data.wishes || [])
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
    setWishes([])
  }

  const patchWish = useCallback(
    async (wishId: string, updates: Record<string, unknown>) => {
      try {
        const res = await fetch('/api/admin/wishes', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', 'x-admin-pin': pin },
          body: JSON.stringify({ wishId, ...updates }),
        })
        if (!res.ok) throw new Error('Update failed')
        const data = await res.json()
        setWishes((prev) => prev.map((w) => (w.id === wishId ? data.wish : w)))
      } catch {
        alert('Update failed')
      }
    },
    [pin]
  )

  const deleteWish = useCallback(
    async (wish: Wish) => {
      if (!confirm(`Permanently delete this wish from "${wish.name}"?\n\n"${wish.message}"`))
        return
      try {
        const res = await fetch(`/api/admin/wishes?id=${wish.id}`, {
          method: 'DELETE',
          headers: { 'x-admin-pin': pin },
        })
        if (!res.ok) throw new Error('Delete failed')
        setWishes((prev) => prev.filter((w) => w.id !== wish.id))
      } catch {
        alert('Delete failed')
      }
    },
    [pin]
  )

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
            Enter your PIN to moderate wishes.
          </p>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              inputMode="numeric"
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

  const stats = {
    total: wishes.length,
    visible: wishes.filter((w) => !w.is_hidden).length,
    pinned: wishes.filter((w) => w.is_pinned).length,
    hidden: wishes.filter((w) => w.is_hidden).length,
  }

  return (
    <div className="min-h-screen px-4 py-8 md:px-8">
      <div className="mx-auto mb-8 flex max-w-5xl flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-3xl font-light italic text-gradient-gold md:text-4xl">
            Wishes Moderation
          </h1>
          <p className="mt-1 font-sans text-sm text-cream/60">
            Pin, hide, or remove wishes
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
      <div className="mx-auto mb-8 grid max-w-5xl grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { label: 'Total', value: stats.total, color: 'text-cream' },
          { label: 'Visible', value: stats.visible, color: 'text-emerald-300' },
          { label: 'Pinned', value: stats.pinned, color: 'text-gold' },
          { label: 'Hidden', value: stats.hidden, color: 'text-destructive/80' },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            className="rounded-xl border border-gold/15 bg-card/30 p-4 backdrop-blur-sm"
          >
            <p className="font-mono text-xs uppercase tracking-wider text-cream/60">{label}</p>
            <p className={`mt-1 font-heading text-2xl font-light ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      <div className="mx-auto max-w-5xl space-y-3">
        {wishes.length === 0 ? (
          <p className="py-12 text-center font-sans text-cream/60">No wishes yet.</p>
        ) : (
          wishes.map((wish) => (
            <div
              key={wish.id}
              className={`rounded-2xl border bg-card/30 p-5 backdrop-blur-sm md:p-6 ${
                wish.is_hidden
                  ? 'border-destructive/20 opacity-60'
                  : wish.is_pinned
                    ? 'border-gold/40 bg-gold/[0.04]'
                    : 'border-gold/15'
              }`}
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-heading text-lg font-light italic text-cream">
                      {wish.name}
                    </h3>
                    {wish.is_pinned && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-gold/40 bg-gold/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-gold">
                        <Pin className="h-2.5 w-2.5" />
                        Pinned
                      </span>
                    )}
                    {wish.is_hidden && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-destructive/30 bg-destructive/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-destructive/90">
                        <EyeOff className="h-2.5 w-2.5" />
                        Hidden
                      </span>
                    )}
                  </div>
                  <p className="mt-2 font-sans text-sm leading-relaxed text-cream/85 [overflow-wrap:break-word]">
                    {wish.message}
                  </p>
                  <p className="mt-2 font-mono text-xs text-cream/40">
                    {timeAgo(wish.created_at)}
                    {wish.ip_address && <span className="ml-3">· {wish.ip_address}</span>}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => patchWish(wish.id, { is_pinned: !wish.is_pinned })}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-gold/30 bg-gold/5 px-3 py-2 font-mono text-xs uppercase tracking-wider text-gold transition hover:bg-gold/15"
                  >
                    {wish.is_pinned ? (
                      <>
                        <PinOff className="h-3.5 w-3.5" />
                        Unpin
                      </>
                    ) : (
                      <>
                        <Pin className="h-3.5 w-3.5" />
                        Pin
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => patchWish(wish.id, { is_hidden: !wish.is_hidden })}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-cream/20 bg-cream/5 px-3 py-2 font-mono text-xs uppercase tracking-wider text-cream/70 transition hover:bg-cream/10"
                  >
                    {wish.is_hidden ? (
                      <>
                        <Eye className="h-3.5 w-3.5" />
                        Show
                      </>
                    ) : (
                      <>
                        <EyeOff className="h-3.5 w-3.5" />
                        Hide
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => deleteWish(wish)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 font-mono text-xs uppercase tracking-wider text-destructive/90 transition hover:bg-destructive/20"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}