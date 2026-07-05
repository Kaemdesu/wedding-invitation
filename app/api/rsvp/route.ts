import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function verifyPin(req: NextRequest): boolean {
  const pin = req.headers.get('x-admin-pin')
  const expected = process.env.ADMIN_PIN
  return !!pin && !!expected && pin === expected
}

export async function GET(req: NextRequest) {
  if (!verifyPin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase
      .from('rsvps')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    return NextResponse.json({ rsvps: data || [] })
  } catch (err) {
    console.error('[ADMIN RSVPS GET] Error:', err)
    return NextResponse.json({ error: 'Failed to load RSVPs' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  if (!verifyPin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const { searchParams } = new URL(req.url)
    const rsvpId = searchParams.get('id')?.trim()
    if (!rsvpId) {
      return NextResponse.json({ error: 'RSVP ID is required' }, { status: 400 })
    }
    const supabase = getSupabaseAdmin()
    const { error } = await supabase.from('rsvps').delete().eq('id', rsvpId)
    if (error) throw error
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[ADMIN RSVPS DELETE] Error:', err)
    return NextResponse.json({ error: 'Failed to delete RSVP' }, { status: 500 })
  }
}