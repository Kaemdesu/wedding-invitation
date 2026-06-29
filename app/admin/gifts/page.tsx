'use client'

import { useCallback, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LogOut,
  RefreshCw,
  Lock,
  Check,
  RotateCcw,
  ShoppingBag,
  Gift as GiftIcon,
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  X,
} from 'lucide-react'
import type { Gift, GiftStatus, ShopName } from '@/lib/supabase'

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
    <span className={`inline-flex items-center rounded-full border px-3 py-1 font-mono text-xs uppercase tracking-wider ${color}`}>
      {label}
    </span>
  )
}

/** Empty gift template for "Add new" */
const emptyGiftDraft = {
  name: '',
  description: '',
  price_idr: '',
  image_url: '/placeholder.svg',
  shop_url: '',
  shop_name: '' as ShopName | '',
  display_order: '99',
  is_active: true,
}

type GiftDraft = typeof emptyGiftDraft

export default function AdminGiftsPage() {
  const [pin, setPin] = useState('')
  const [authed, setAuthed] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [gifts, setGifts] = useState<Gift[]>([])
  const [loading, setLoading] = useState(false)

  // Modal state
  const [modalMode, setModalMode] = useState<'closed' | 'create' | 'edit'>('closed')
  const [editingGiftId, setEditingGiftId] = useState<string | null>(null)
  const [draft, setDraft] = useState<GiftDraft>(emptyGiftDraft)
  const [modalError, setModalError] = useState('')
  const [saving, setSaving] = useState(false)

  /** Restore PIN from sessionStorage */
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

  /** PATCH a gift (status, release, edit) */
  const patchGift = useCallback(
    async (giftId: string, updates: Record<string, unknown>) => {
      try {
        const res = await fetch('/api/admin/gifts', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', 'x-admin-pin': pin },
          body: JSON.stringify({ giftId, ...updates }),
        })
        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || 'Update failed')
        }
        const data = await res.json()
        setGifts((prev) => prev.map((g) => (g.id === giftId ? data.gift : g)))
        return true
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Update failed')
        return false
      }
    },
    [pin]
  )

  /** DELETE a gift permanently */
  const deleteGift = useCallback(
    async (gift: Gift) => {
      const reserved = gift.status !== 'available'
      const confirmMsg = reserved
        ? `⚠️ "${gift.name}" is currently ${gift.status.toUpperCase()}${gift.reserved_by_name ? ` by ${gift.reserved_by_name}` : ''}. Are you sure you want to PERMANENTLY DELETE it?`
        : `Permanently delete "${gift.name}"? This cannot be undone.`
      if (!confirm(confirmMsg)) return

      try {
        const res = await fetch(`/api/admin/gifts?id=${gift.id}`, {
          method: 'DELETE',
          headers: { 'x-admin-pin': pin },
        })
        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || 'Delete failed')
        }
        setGifts((prev) => prev.filter((g) => g.id !== gift.id))
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Delete failed')
      }
    },
    [pin]
  )

  /** Open add-new modal */
  const openCreate = () => {
    const nextOrder = (Math.max(0, ...gifts.map((g) => g.display_order)) + 1).toString()
    setDraft({ ...emptyGiftDraft, display_order: nextOrder })
    setEditingGiftId(null)
    setModalError('')
    setModalMode('create')
  }

  /** Open edit modal */
  const openEdit = (gift: Gift) => {
    setDraft({
      name: gift.name,
      description: gift.description || '',
      price_idr: String(gift.price_idr),
      image_url: gift.image_url || '/placeholder.svg',
      shop_url: gift.shop_url || '',
      shop_name: gift.shop_name || '',
      display_order: String(gift.display_order),
      is_active: gift.is_active,
    })
    setEditingGiftId(gift.id)
    setModalError('')
    setModalMode('edit')
  }

  const closeModal = () => {
    setModalMode('closed')
    setEditingGiftId(null)
    setModalError('')
  }

  /** Submit modal (create or edit) */
  const handleModalSave = async () => {
    if (!draft.name.trim()) {
      setModalError('Name is required')
      return
    }
    const priceNum = Number(draft.price_idr)
    if (isNaN(priceNum) || priceNum < 0) {
      setModalError('Price must be a positive number')
      return
    }

    setSaving(true)
    setModalError('')
    try {
      if (modalMode === 'create') {
        const res = await fetch('/api/admin/gifts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-admin-pin': pin },
          body: JSON.stringify({
            name: draft.name,
            description: draft.description,
            price_idr: priceNum,
            image_url: draft.image_url,
            shop_url: draft.shop_url,
            shop_name: draft.shop_name || null,
            display_order: Number(draft.display_order) || 0,
            is_active: draft.is_active,
          }),
        })
        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || 'Create failed')
        }
        const data = await res.json()
        setGifts((prev) =>
          [...prev, data.gift].sort((a, b) => a.display_order - b.display_order)
        )
      } else if (modalMode === 'edit' && editingGiftId) {
        const ok = await patchGift(editingGiftId, {
          name: draft.name,
          description: draft.description || null,
          price_idr: priceNum,
          image_url: draft.image_url,
          shop_url: draft.shop_url || null,
          shop_name: draft.shop_name || null,
          display_order: Number(draft.display_order) || 0,
          is_active: draft.is_active,
        })
        if (!ok) throw new Error('Update failed')
        // Re-sort if display_order changed
        setGifts((prev) =>
          [...prev].sort((a, b) => a.display_order - b.display_order)
        )
      }
      closeModal()
    } catch (err) {
      setModalError(err instanceof Error ? err.message : 'Save failed')
    }
    setSaving(false)
  }

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
              <p className="mt-3 text-center font-sans text-sm text-destructive">{loginError}</p>
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
    total: gifts.length,
    available: gifts.filter((g) => g.status === 'available').length,
    reserved: gifts.filter((g) => g.status === 'reserved').length,
    purchased: gifts.filter((g) => g.status === 'purchased').length,
    received: gifts.filter((g) => g.status === 'received').length,
  }

  return (
    <div className="min-h-screen px-4 py-8 md:px-8">
      {/* Header */}
      <div className="mx-auto mb-8 flex max-w-6xl flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-3xl font-light italic text-gradient-gold md:text-4xl">
            Gift Registry Admin
          </h1>
          <p className="mt-1 font-sans text-sm text-cream/60">
            Manage reservations, edit & add gifts
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-lg border border-gold/40 bg-gold/10 px-4 py-2 font-mono text-xs uppercase tracking-wider text-gold transition hover:border-gold hover:bg-gold/20"
          >
            <Plus className="h-4 w-4" />
            Add Gift
          </button>
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
          <div key={label} className="rounded-xl border border-gold/15 bg-card/30 p-4 backdrop-blur-sm">
            <p className="font-mono text-xs uppercase tracking-wider text-cream/60">{label}</p>
            <p className={`mt-1 font-heading text-2xl font-light ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Gifts list */}
      <div className="mx-auto max-w-6xl space-y-3">
        {gifts.length === 0 ? (
          <p className="py-12 text-center font-sans text-cream/60">
            No gifts yet. Click <span className="text-gold">Add Gift</span> to create your first one.
          </p>
        ) : (
          gifts.map((gift) => (
            <div
              key={gift.id}
              className={`rounded-2xl border bg-card/30 p-4 backdrop-blur-sm md:p-6 ${
                gift.is_active ? 'border-gold/20' : 'border-cream/10 opacity-60'
              }`}
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-heading text-lg font-light italic text-cream md:text-xl">
                      {gift.name}
                    </h3>
                    <StatusBadge status={gift.status} />
                    {!gift.is_active && (
                      <span className="inline-flex items-center rounded-full border border-cream/15 bg-cream/5 px-3 py-1 font-mono text-xs uppercase tracking-wider text-cream/60">
                        Hidden
                      </span>
                    )}
                    {gift.shop_name && (
                      <span className="font-mono text-xs uppercase tracking-wider text-cream/50">
                        · {gift.shop_name}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 font-mono text-sm text-gold">
                    {formatPrice(gift.price_idr)}
                    <span className="ml-3 text-cream/40">order: {gift.display_order}</span>
                  </p>
                  {gift.description && (
                    <p className="mt-2 font-sans text-sm text-cream/70">{gift.description}</p>
                  )}
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
                      onClick={() => patchGift(gift.id, { status: 'purchased' })}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-blue-500/30 bg-blue-500/10 px-3 py-2 font-mono text-xs uppercase tracking-wider text-blue-300 transition hover:bg-blue-500/20"
                    >
                      <ShoppingBag className="h-3.5 w-3.5" />
                      Purchased
                    </button>
                  )}
                  {(gift.status === 'reserved' || gift.status === 'purchased') && (
                    <button
                      onClick={() => patchGift(gift.id, { status: 'received' })}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-violet-500/30 bg-violet-500/10 px-3 py-2 font-mono text-xs uppercase tracking-wider text-violet-300 transition hover:bg-violet-500/20"
                    >
                      <GiftIcon className="h-3.5 w-3.5" />
                      Received
                    </button>
                  )}
                  {(gift.status === 'reserved' ||
                    gift.status === 'purchased' ||
                    gift.status === 'received') && (
                    <button
                      onClick={() => {
                        if (confirm(`Release reservation for "${gift.name}"?`))
                          patchGift(gift.id, { clearReservation: true })
                      }}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 font-mono text-xs uppercase tracking-wider text-amber-300 transition hover:bg-amber-500/20"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      Release
                    </button>
                  )}
                  {gift.status === 'available' && (
                    <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2">
                      <Check className="h-3.5 w-3.5 text-emerald-300" />
                      <span className="font-mono text-xs uppercase tracking-wider text-emerald-300">
                        Open
                      </span>
                    </div>
                  )}
                  <button
                    onClick={() => patchGift(gift.id, { is_active: !gift.is_active })}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-cream/20 bg-cream/5 px-3 py-2 font-mono text-xs uppercase tracking-wider text-cream/70 transition hover:bg-cream/10"
                    title={gift.is_active ? 'Hide from public' : 'Show on public'}
                  >
                    {gift.is_active ? (
                      <>
                        <EyeOff className="h-3.5 w-3.5" />
                        Hide
                      </>
                    ) : (
                      <>
                        <Eye className="h-3.5 w-3.5" />
                        Show
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => openEdit(gift)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-gold/30 bg-gold/5 px-3 py-2 font-mono text-xs uppercase tracking-wider text-gold transition hover:bg-gold/15"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </button>
                  <button
                    onClick={() => deleteGift(gift)}
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

      {/* Create / Edit Modal */}
      <AnimatePresence>
        {modalMode !== 'closed' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeModal}
            className="fixed inset-0 z-50 flex items-end justify-center bg-background/85 p-4 backdrop-blur-md sm:items-center"
          >
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.96 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl overflow-y-auto rounded-2xl border border-gold/30 bg-background p-6 md:p-8"
              style={{ maxHeight: '90vh' }}
            >
              <div className="mb-6 flex items-start justify-between gap-4">
                <h2 className="font-heading text-2xl font-light italic text-gradient-gold">
                  {modalMode === 'create' ? 'Add New Gift' : 'Edit Gift'}
                </h2>
                <button
                  onClick={closeModal}
                  className="rounded-lg p-1 text-muted-foreground transition hover:text-cream"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Name */}
                <div className="md:col-span-2">
                  <label className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-gold">
                    Gift Name *
                  </label>
                  <input
                    type="text"
                    value={draft.name}
                    onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                    placeholder="e.g., Espresso Coffee Machine"
                    maxLength={100}
                    className="w-full rounded-lg border border-gold/25 bg-background/60 px-4 py-2.5 font-sans text-cream placeholder:text-muted-foreground/50 outline-none focus:border-gold focus:ring-1 focus:ring-gold/50"
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-gold">
                    Description
                  </label>
                  <textarea
                    value={draft.description}
                    onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                    placeholder="A short, sweet note about this gift..."
                    rows={2}
                    maxLength={300}
                    className="w-full resize-none rounded-lg border border-gold/25 bg-background/60 px-4 py-2.5 font-sans text-cream placeholder:text-muted-foreground/50 outline-none focus:border-gold focus:ring-1 focus:ring-gold/50"
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-gold">
                    Price (IDR) *
                  </label>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={draft.price_idr}
                    onChange={(e) => setDraft({ ...draft, price_idr: e.target.value })}
                    placeholder="2500000"
                    min={0}
                    className="w-full rounded-lg border border-gold/25 bg-background/60 px-4 py-2.5 font-mono text-cream placeholder:text-muted-foreground/50 outline-none focus:border-gold focus:ring-1 focus:ring-gold/50"
                  />
                </div>

                {/* Display order */}
                <div>
                  <label className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-gold">
                    Display Order
                  </label>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={draft.display_order}
                    onChange={(e) => setDraft({ ...draft, display_order: e.target.value })}
                    placeholder="1"
                    min={0}
                    className="w-full rounded-lg border border-gold/25 bg-background/60 px-4 py-2.5 font-mono text-cream placeholder:text-muted-foreground/50 outline-none focus:border-gold focus:ring-1 focus:ring-gold/50"
                  />
                  <p className="mt-1 font-mono text-xs text-cream/40">Lower = appears first</p>
                </div>

                {/* Image URL */}
                <div className="md:col-span-2">
                  <label className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-gold">
                    Image URL
                  </label>
                  <input
                    type="text"
                    value={draft.image_url}
                    onChange={(e) => setDraft({ ...draft, image_url: e.target.value })}
                    placeholder="/placeholder.svg or https://tokopedia.com/..."
                    className="w-full rounded-lg border border-gold/25 bg-background/60 px-4 py-2.5 font-mono text-sm text-cream placeholder:text-muted-foreground/50 outline-none focus:border-gold focus:ring-1 focus:ring-gold/50"
                  />
                  <p className="mt-1 font-mono text-xs text-cream/40">
                    Tip: right-click product image on shop site → "Copy image address"
                  </p>
                </div>

                {/* Shop name */}
                <div>
                  <label className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-gold">
                    Shop
                  </label>
                  <select
                    value={draft.shop_name}
                    onChange={(e) =>
                      setDraft({ ...draft, shop_name: e.target.value as ShopName | '' })
                    }
                    className="w-full rounded-lg border border-gold/25 bg-background/60 px-4 py-2.5 font-sans text-cream outline-none focus:border-gold focus:ring-1 focus:ring-gold/50"
                  >
                    <option value="">— None —</option>
                    <option value="tokopedia">Tokopedia</option>
                    <option value="shopee">Shopee</option>
                    <option value="lazada">Lazada</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Shop URL */}
                <div>
                  <label className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-gold">
                    Shop URL
                  </label>
                  <input
                    type="text"
                    value={draft.shop_url}
                    onChange={(e) => setDraft({ ...draft, shop_url: e.target.value })}
                    placeholder="https://www.tokopedia.com/..."
                    className="w-full rounded-lg border border-gold/25 bg-background/60 px-4 py-2.5 font-mono text-sm text-cream placeholder:text-muted-foreground/50 outline-none focus:border-gold focus:ring-1 focus:ring-gold/50"
                  />
                </div>

                {/* Active toggle */}
                <div className="md:col-span-2">
                  <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gold/20 bg-background/40 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={draft.is_active}
                      onChange={(e) => setDraft({ ...draft, is_active: e.target.checked })}
                      className="h-4 w-4 accent-gold"
                    />
                    <div className="flex-1">
                      <p className="font-sans text-sm text-cream">Show on public registry</p>
                      <p className="font-mono text-xs text-cream/50">
                        Uncheck to hide this gift from guests (you can still see it here)
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {modalError && (
                <p className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-center font-sans text-sm text-destructive">
                  {modalError}
                </p>
              )}

              <div className="mt-6 flex gap-3">
                <button
                  onClick={closeModal}
                  disabled={saving}
                  className="flex-1 rounded-lg border border-gold/25 px-4 py-3 font-mono text-xs uppercase tracking-[0.2em] text-cream/70 transition hover:border-gold/50 hover:text-cream disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleModalSave}
                  disabled={saving || !draft.name.trim()}
                  className="flex-1 rounded-lg bg-gradient-gold px-4 py-3 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-background transition disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving
                    ? 'Saving...'
                    : modalMode === 'create'
                      ? 'Create Gift'
                      : 'Save Changes'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}