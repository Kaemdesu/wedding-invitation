import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

/** Browser/edge client — uses anon key, respects RLS */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false },
})

/** Server-only admin client — bypasses RLS, NEVER use in browser code */
export function getSupabaseAdmin() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceKey) throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set')
  return createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
  })
}

/** Type definitions */
export type Rsvp = {
  id: string
  full_name: string
  email: string
  attendance: 'accept' | 'decline'
  guest_count: number
  note: string | null
  created_at: string
  ip_address: string | null
  user_agent: string | null
}