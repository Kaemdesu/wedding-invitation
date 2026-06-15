import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const DATA_FILE = path.join(process.cwd(), 'data', 'gift-reservations.json')

function ensureDataFile() {
  const dir = path.dirname(DATA_FILE)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, '{}', 'utf-8')
  }
}

function getReservations(): Record<string, string> {
  ensureDataFile()
  const raw = fs.readFileSync(DATA_FILE, 'utf-8')
  try {
    return JSON.parse(raw)
  } catch {
    return {}
  }
}

function saveReservations(data: Record<string, string>) {
  ensureDataFile()
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8')
}

export async function GET() {
  const reservations = getReservations()
  return NextResponse.json(reservations)
}

export async function POST(request: Request) {
  const body = await request.json()
  const { giftId, guestName } = body

  if (!giftId || !guestName) {
    return NextResponse.json(
      { error: 'Missing giftId or guestName' },
      { status: 400 }
    )
  }

  const reservations = getReservations()

  if (reservations[giftId]) {
    return NextResponse.json(
      { error: 'This gift has already been reserved.' },
      { status: 409 }
    )
  }

  reservations[giftId] = guestName
  saveReservations(reservations)

  return NextResponse.json({ success: true, reservations })
}