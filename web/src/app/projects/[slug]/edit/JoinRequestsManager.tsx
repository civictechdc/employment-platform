'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { JoinRequest, Volunteer } from '@/lib/types'

type RequestWithVolunteer = JoinRequest & { volunteers: Volunteer }

export default function JoinRequestsManager({
  projectId,
  requests,
  onRequestsChange,
}: {
  projectId: string
  requests: RequestWithVolunteer[]
  onRequestsChange: (requests: RequestWithVolunteer[]) => void
}) {
  const supabase = createClient()
  const [acting, setActing] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [approvingId, setApprovingId] = useState<string | null>(null)
  const [roleTitle, setRoleTitle] = useState('')

  async function handleApprove(request: RequestWithVolunteer) {
    setActing(request.id)
    setApprovingId(null)
    setError(null)

    const { error: memberError } = await supabase
      .from('project_members')
      .insert({ project_id: projectId, volunteer_id: request.volunteer_id, role_title: roleTitle || null, is_lead: false })

    if (memberError) {
      setError(memberError.message)
      setActing(null)
      return
    }

    const { error: statusError } = await supabase
      .from('join_requests')
      .update({ status: 'approved' })
      .eq('id', request.id)

    if (statusError) {
      setError(statusError.message)
      setActing(null)
      return
    }

    onRequestsChange(requests.filter((r) => r.id !== request.id))
    setRoleTitle('')
    setActing(null)
  }

  async function handleReject(requestId: string) {
    setActing(requestId)
    setError(null)

    const { error } = await supabase
      .from('join_requests')
      .update({ status: 'rejected' })
      .eq('id', requestId)

    if (error) {
      setError(error.message)
      setActing(null)
      return
    }

    onRequestsChange(requests.filter((r) => r.id !== requestId))
    setActing(null)
  }

  if (requests.length === 0) {
    return <p className="text-sm text-gray-500">No pending requests.</p>
  }

  return (
    <div className="flex flex-col gap-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-2 rounded-lg">
          {error}
        </div>
      )}
      {requests.map((r) => (
        <div key={r.id} className="border border-gray-200 rounded-lg p-4 flex flex-col gap-3">
          <div className="flex items-start gap-3">
            {r.volunteers.avatar_url ? (
              <img src={r.volunteers.avatar_url} alt={r.volunteers.name} className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
            ) : (
              <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm font-medium flex-shrink-0">
                {r.volunteers.name.charAt(0)}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">{r.volunteers.name}</p>
              {r.message && (
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">{r.message}</p>
              )}
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={() => { setApprovingId(r.id); setRoleTitle('') }}
                disabled={acting === r.id}
                className="text-xs bg-brand-blue text-white px-3 py-1.5 rounded hover:opacity-90 transition-opacity disabled:opacity-40 cursor-pointer"
              >
                Approve
              </button>
              <button
                onClick={() => handleReject(r.id)}
                disabled={acting === r.id}
                className="text-xs text-gray-600 border border-gray-300 px-3 py-1.5 rounded hover:border-gray-400 transition-colors disabled:opacity-40 cursor-pointer"
              >
                Reject
              </button>
            </div>
          </div>

          {approvingId === r.id && (
            <div className="flex gap-2 pl-12">
              <input
                type="text"
                value={roleTitle}
                onChange={(e) => setRoleTitle(e.target.value)}
                placeholder="Role title (optional)"
                autoFocus
                className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
              />
              <button
                onClick={() => handleApprove(r)}
                disabled={acting === r.id}
                className="text-xs bg-brand-blue text-white px-3 py-1.5 rounded hover:opacity-90 transition-opacity disabled:opacity-40 cursor-pointer"
              >
                {acting === r.id ? 'Approving...' : 'Confirm'}
              </button>
              <button
                onClick={() => setApprovingId(null)}
                className="text-xs text-gray-500 hover:text-gray-800 px-2 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
