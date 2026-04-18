'use client'

import { createClient } from '@/lib/supabase/client'

export function SignInButton() {
  const supabase = createClient()

  const signIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  return (
    <button
      onClick={signIn}
      className="text-sm bg-brand-blue text-white px-4 py-1.5 rounded hover:opacity-90 transition-opacity cursor-pointer"
    >
      Sign in with GitHub
    </button>
  )
}

export function SignOutButton() {
  const supabase = createClient()

  const signOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <button
      onClick={signOut}
      className="text-sm text-gray-600 hover:text-brand-blue hover:opacity-80 transition-colors cursor-pointer"
    >
      Sign out
    </button>
  )
}
