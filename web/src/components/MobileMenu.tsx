'use client'

import { useState } from 'react'
import Link from 'next/link'
import { SignInButton, SignOutButton } from './AuthButton'

interface MobileMenuProps {
  isLoggedIn: boolean
  showNewProject: boolean
  volunteerId: string | null
  avatarUrl: string | null
  username: string | null
}

export default function MobileMenu({ isLoggedIn, showNewProject, volunteerId, avatarUrl, username }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-600 hover:text-brand-blue transition-colors"
        aria-label="Toggle menu"
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-md z-50 px-6 py-4 flex flex-col gap-4">
          <Link href="/" onClick={() => setIsOpen(false)} className="text-sm text-gray-600 hover:text-brand-blue transition-colors">
            Projects
          </Link>
          <Link href="/jobs" onClick={() => setIsOpen(false)} className="text-sm text-gray-600 hover:text-brand-blue transition-colors">
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
          <div className="border-t border-gray-100 pt-4 flex flex-col gap-3">
            {isLoggedIn ? (
              <>
                {showNewProject && (
                  <Link
                    href="/admin/projects/new"
                    onClick={() => setIsOpen(false)}
                    className="text-sm bg-brand-blue text-white px-4 py-1.5 rounded hover:opacity-90 transition-opacity text-center"
                  >
                    New Project
                  </Link>
                )}
                {volunteerId && (
                  <Link
                    href={`/volunteers/${volunteerId}`}
                    onClick={() => setIsOpen(false)}
                    className="text-sm text-gray-600 hover:text-brand-blue transition-colors"
                  >
                    My Profile
                  </Link>
                )}
                {avatarUrl && (
                  <div className="flex items-center gap-2">
                    <img
                      src={avatarUrl}
                      alt={username ?? 'User'}
                      className="w-8 h-8 rounded-full"
                    />
                    {username && <span className="text-sm text-gray-600">{username}</span>}
                  </div>
                )}
                <SignOutButton />
              </>
            ) : (
              <SignInButton />
            )}
          </div>
        </div>
      )}
    </div>
  )
}
