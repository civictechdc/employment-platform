'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Volunteer } from '@/lib/types'

export default function EditProfileForm({ volunteer }: { volunteer: Volunteer }) {
  const router = useRouter()
  const supabase = createClient()

  const [name, setName] = useState(volunteer.name)
  const [bio, setBio] = useState(volunteer.bio ?? '')
  const [skillsInput, setSkillsInput] = useState(volunteer.skills.join(', '))
  const [linkedinUrl, setLinkedinUrl] = useState(volunteer.linkedin_url ?? '')
  const [githubUrl, setGithubUrl] = useState(volunteer.github_url ?? '')
  const [websiteUrl, setWebsiteUrl] = useState(volunteer.website_url ?? '')
  const [avatarUrl, setAvatarUrl] = useState(volunteer.avatar_url ?? '')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    const skills = skillsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)

    const { error: updateError } = await supabase
      .from('volunteers')
      .update({
        name,
        bio: bio || null,
        skills,
        linkedin_url: linkedinUrl || null,
        github_url: githubUrl || null,
        website_url: websiteUrl || null,
        avatar_url: avatarUrl || null,
      })
      .eq('id', volunteer.id)

    if (updateError) {
      setError(updateError.message)
      setSubmitting(false)
      return
    }

    router.push(`/volunteers/${volunteer.id}`)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-700">
          Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-700">Bio</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={4}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent resize-none"
          placeholder="Tell people a bit about yourself and your background."
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-700">Skills</label>
        <input
          type="text"
          value={skillsInput}
          onChange={(e) => setSkillsInput(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
          placeholder="React, Python, UX Design"
        />
        <p className="text-xs text-gray-500">Comma-separated</p>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-700">Avatar URL</label>
        <input
          type="url"
          value={avatarUrl}
          onChange={(e) => setAvatarUrl(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
          placeholder="https://..."
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-700">LinkedIn</label>
        <input
          type="url"
          value={linkedinUrl}
          onChange={(e) => setLinkedinUrl(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
          placeholder="https://linkedin.com/in/yourname"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-700">GitHub</label>
        <input
          type="url"
          value={githubUrl}
          onChange={(e) => setGithubUrl(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
          placeholder="https://github.com/yourname"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-700">Website</label>
        <input
          type="url"
          value={websiteUrl}
          onChange={(e) => setWebsiteUrl(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
          placeholder="https://yoursite.com"
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="text-sm text-gray-600 hover:text-gray-900 px-4 py-2 transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="text-sm bg-brand-blue text-white px-6 py-2 rounded hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
        >
          {submitting ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  )
}
