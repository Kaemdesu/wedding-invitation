import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function verifyPin(req: NextRequest): boolean {
  const pin = req.headers.get('x-admin-pin')
  const expected = process.env.ADMIN_PIN
  return !!pin && !!expected && pin === expected
}

/** GET — list ALL gifts including reserved emails (admin only) */
export async function GET(req: NextRequest) {
  if (!verifyPin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase
      .from('gifts')
      .select('*')
      .order('display_order', { ascending: true })

    if (error) throw error
    return NextResponse.json({ gifts: data || [] })
  } catch (err) {
    console.error('[ADMIN GIFTS GET] Error:', err)
    return NextResponse.json({ error: 'Failed to load gifts' }, { status: 500 })
  }
}

/** PATCH — update gift status (e.g., mark as purchased/received, or release reservation) */
type PatchPayload = {
  giftId?: string
  status?: 'available' | 'reserved' | 'purchased' | 'received'
  clearReservation?: boolean
}

export async function PATCH(req: NextRequest) {
  if (!verifyPin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = (await req.json()) as PatchPayload
    const giftId = body.giftId?.trim()
    if (!giftId) {
      return NextResponse.json({ error: 'Gift ID is required' }, { status: 400 })
    }

    const supabase = getSupabaseAdmin()

    const updates: Record<string, unknown> = {}
    if (body.status) updates.status = body.status
    if (body.clearReservation) {
      updates.status = 'available'
      updates.reserved_by_name = null
      updates.reserved_by_email = null
      updates.reserved_at = null
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No updates provided' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('gifts')
      .update(updates)
      .eq('id', giftId)
      .select('*')
      .single()

    if (error) throw error
    return NextResponse.json({ ok: true, gift: data })
  } catch (err) {
    console.error('[ADMIN GIFTS PATCH] Error:', err)
    return NextResponse.json({ error: 'Failed to update gift' }, { status: 500 })
  }
}