// Re-export the server client for use in Server Components and pages.
// For auth operations in Client Components, use @/lib/supabase/client instead.
export { createClient as supabaseServer } from '@/lib/supabase/server'

import { createClient } from '@supabase/supabase-js'

// Simple client for server-side data fetching in pages (no auth needed)
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
