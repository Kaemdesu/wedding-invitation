import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export const runtime = 'nodejs'

type RsvpPayload = {
  fullName?: string
  email?: string
  attendance?: 'accept' | 'decline'
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as RsvpPayload

    // ---- Validation ----
    const fullName = body.fullName?.trim()
    const email = body.email?.trim().toLowerCase()
    const attendance = body.attendance

    if (!fullName || fullName.length < 2) {
      return NextResponse.json(
        { error: 'Please enter your full name' },
        { status: 400 }
      )
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email' },
        { status: 400 }
      )
    }
    if (attendance !== 'accept' && attendance !== 'decline') {
      return NextResponse.json(
        { error: 'Please select attendance' },
        { status: 400 }
      )
    }

    // ---- Capture metadata (anti-spam tracking) ----
    const ipAddress =
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      req.headers.get('x-real-ip') ||
      null
    const userAgent = req.headers.get('user-agent') || null

    // ---- Insert into Supabase ----
    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase
      .from('rsvps')
      .insert({
        full_name: fullName,
        email,
        attendance,
        ip_address: ipAddress,
        user_agent: userAgent,
      })
      .select('id')
      .single()

    if (error) {
      // Unique violation = already RSVPd with this email
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'This email has already submitted an RSVP. Thank you!' },
          { status: 409 }
        )
      }
      console.error('[RSVP] Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to save RSVP. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ ok: true, id: data.id })
  } catch (err) {
    console.error('[RSVP] Unexpected error:', err)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}