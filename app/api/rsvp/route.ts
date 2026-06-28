import { NextResponse } from 'next/server'

const GOOGLE_SHEETS_URL = process.env.GOOGLE_SHEETS_RSVP_URL || ''

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { fullName, email, attendance, note } = body

    if (!fullName || !email || !attendance) {
      return NextResponse.json(
        { error: 'Please fill in all required fields.' },
        { status: 400 }
      )
    }

    if (GOOGLE_SHEETS_URL) {
      // Google Apps Script returns a redirect — we need to follow it
      // and not throw on non-2xx responses
      await fetch(GOOGLE_SHEETS_URL, {
        method: 'POST',
        body: JSON.stringify({ fullName, email, attendance, note }),
        headers: { 'Content-Type': 'text/plain' },
        redirect: 'follow',
      })
    } else {
      console.warn('GOOGLE_SHEETS_RSVP_URL is not set')
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('RSVP error:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}