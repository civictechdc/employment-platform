'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface JoinRequestButtonProps {
  projectId: string
  volunteerId: string
  hasPendingRequest: boolean
}

export default function JoinRequestButton({ projectId, volunteerId, hasPendingRequest }: JoinRequestButtonProps) {
  const [pending, setPending] = useState(hasPendingRequest)
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit() {
    setSubmitting(true)
    setError(null)
    const supabase = createClient()
    const { error } = await supabase
      .from('join_requests')
      .insert({ project_id: projectId, volunteer_id: volunteerId, message: message || null })

    if (error) {
      setError(error.message)
      setSubmitting(false)
      return
    }

    setPending(true)
    setOpen(false)
    setSubmitting(false)
  }

  if (pending) {
    return (
      <p className="text-sm text-gray-500 border border-gray-200 rounded px-4 py-2 text-center">
        Request pending
      </p>
    )
  }

  if (open) {
    return (
      <div className="flex flex-col gap-3">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Optional message to the project lead..."
          rows={3}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent resize-none"
        />
        {error && <p className="text-xs text-red-600">{error}</p>}
        <div className="flex gap-2">
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="text-sm bg-brand-blue text-white px-4 py-2 rounded hover:opacity-90 transition-opacity disabled:opacity-40 cursor-pointer"
          >
            {submitting ? 'Sending...' : 'Send Request'}
          </button>
          <button
            onClick={() => setOpen(false)}
            className="text-sm text-gray-600 hover:text-gray-900 px-4 py-2 cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  return (
    <button
      onClick={() => setOpen(true)}
      className="w-full text-sm bg-brand-blue text-white px-4 py-2 rounded hover:opacity-90 transition-opacity cursor-pointer"
    >
      Request to Join
    </button>
  )
}
