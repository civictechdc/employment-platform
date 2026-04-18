import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { SignInButton, SignOutButton } from './AuthButton'

export default async function Header() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-serif font-bold text-gray-900 text-lg hover:text-brand-blue transition-colors">
          Civic Tech DC
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/" className="text-sm text-gray-600 hover:text-brand-blue transition-colors">
            Projects
          </Link>
          <Link href="/jobs" className="text-sm text-gray-600 hover:text-brand-blue transition-colors">
            Open Roles
          </Link>
          <a
            href="https://www.civictechdc.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-600 hover:text-brand-blue transition-colors"
          >
            Main Site
          </a>
          <a
            href="https://www.civictechdc.org/slack"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-600 hover:text-brand-blue transition-colors"
          >
            Slack
          </a>
          {user ? (
            <div className="flex items-center gap-3">
              {user.user_metadata?.avatar_url && (
                <img
                  src={user.user_metadata.avatar_url}
                  alt={user.user_metadata.user_name ?? 'User'}
                  className="w-8 h-8 rounded-full"
                />
              )}
              <SignOutButton />
            </div>
          ) : (
            <SignInButton />
          )}
        </nav>
      </div>
    </header>
  )
}
