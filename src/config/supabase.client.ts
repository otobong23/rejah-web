
import { createClient } from '@supabase/supabase-js'
const supabaseUrl = process.env.NEXT_PUBLIC_SUPA_BACKEND_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPA_ANON_KEY!

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL or Key is not defined in environment variables')
}

const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase