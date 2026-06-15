import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const { fullName, email, attendance } = body ?? {}
    if (!fullName || !email || !attendance) {
      return NextResponse.json(
        { error: 'Please fill in your name, email, and attendance.' },
        { status: 400 },
      )
    }

    const webAppUrl = process.env.GOOGLE_SHEETS_WEBAPP_URL

    // If the Google Apps Script endpoint isn't configured yet, accept the
    // submission gracefully so the form still works during setup.
    if (!webAppUrl) {
      console.log('[v0] RSVP received (no GOOGLE_SHEETS_WEBAPP_URL set):', body)
      return NextResponse.json({ ok: true, stored: false })
    }

    const payload = {
      ...body,
      submittedAt: new Date().toISOString(),
    }

    const res = await fetch(webAppUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const text = await res.text()
      console.log('[v0] Google Sheets responded with error:', res.status, text)
      return NextResponse.json(
        { error: 'We could not save your RSVP. Please try again.' },
        { status: 502 },
      )
    }

    return NextResponse.json({ ok: true, stored: true })
  } catch (err) {
    console.log('[v0] RSVP route error:', (err as Error).message)
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}
