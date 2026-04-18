'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { ProjectMember, Volunteer } from '@/lib/types'

type Member = ProjectMember & { volunteers: Volunteer }

export default function TeamManager({
  projectId,
  initialMembers,
}: {
  projectId: string
  initialMembers: Member[]
}) {
  const supabase = createClient()
  const [members, setMembers] = useState<Member[]>(initialMembers)

  // Search state
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Volunteer[]>([])
  const [searching, setSearching] = useState(false)
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Add member form state
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null)
  const [roleTitle, setRoleTitle] = useState('')
  const [isLead, setIsLead] = useState(false)
  const [adding, setAdding] = useState(false)
  const [addError, setAddError] = useState<string | null>(null)

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    if (selectedVolunteer && query === selectedVolunteer.name) {
      setResults([])
      return
    }

    if (searchTimeout.current) clearTimeout(searchTimeout.current)
    searchTimeout.current = setTimeout(async () => {
      setSearching(true)
      const existingIds = members.map((m) => m.volunteer_id)
      let volunteersQuery = supabase
        .from('volunteers')
        .select('*')
        .ilike('name', `%${query}%`)
        .limit(5)
      if (existingIds.length > 0) {
        volunteersQuery = volunteersQuery.not('id', 'in', `(${existingIds.join(',')})`)
      }
      const { data } = await volunteersQuery
      setResults(data ?? [])
      setSearching(false)
    }, 300)
  }, [query, members])

  function selectVolunteer(v: Volunteer) {
    setSelectedVolunteer(v)
    setQuery(v.name)
    setResults([])
  }

  async function handleAdd() {
    if (!selectedVolunteer) return
    setAdding(true)
    setAddError(null)

    const { data, error } = await supabase
      .from('project_members')
      .insert({
        project_id: projectId,
        volunteer_id: selectedVolunteer.id,
        role_title: roleTitle || null,
        is_lead: isLead,
      })
      .select('*, volunteers(*)')
      .single()

    if (error) {
      setAddError(error.message)
      setAdding(false)
      return
    }

    setMembers((prev) => [...prev, data as Member])
    setSelectedVolunteer(null)
    setQuery('')
    setRoleTitle('')
    setIsLead(false)
    setAdding(false)
  }

  async function handleRemove(memberId: string) {
    const { error } = await supabase
      .from('project_members')
      .delete()
      .eq('id', memberId)

    if (!error) {
      setMembers((prev) => prev.filter((m) => m.id !== memberId))
    }
  }

  async function handleUpdateRole(memberId: string, field: 'role_title' | 'is_lead', value: string | boolean) {
    const { error } = await supabase
      .from('project_members')
      .update({ [field]: value })
      .eq('id', memberId)

    if (!error) {
      setMembers((prev) =>
        prev.map((m) => (m.id === memberId ? { ...m, [field]: value } : m))
      )
    }
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Current members */}
      {members.length > 0 && (
        <div className="flex flex-col gap-3">
          {members.map((m) => (
            <div key={m.id} className="flex items-center gap-3 border border-gray-200 rounded-lg p-3">
              {m.volunteers.avatar_url ? (
                <img src={m.volunteers.avatar_url} alt={m.volunteers.name} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm font-medium flex-shrink-0">
                  {m.volunteers.name.charAt(0)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{m.volunteers.name}</p>
                <input
                  type="text"
                  value={m.role_title ?? ''}
                  onChange={(e) => handleUpdateRole(m.id, 'role_title', e.target.value)}
                  onBlur={(e) => handleUpdateRole(m.id, 'role_title', e.target.value)}
                  placeholder="Role title"
                  className="text-xs text-gray-500 border-0 p-0 focus:outline-none focus:ring-0 bg-transparent w-full mt-0.5"
                />
              </div>
              <label className="flex items-center gap-1.5 text-xs text-gray-500 cursor-pointer flex-shrink-0">
                <input
                  type="checkbox"
                  checked={m.is_lead}
                  onChange={(e) => handleUpdateRole(m.id, 'is_lead', e.target.checked)}
                  className="cursor-pointer"
                />
                Lead
              </label>
              <button
                onClick={() => handleRemove(m.id)}
                className="text-gray-400 hover:text-red-500 transition-colors text-lg leading-none flex-shrink-0 cursor-pointer"
                aria-label="Remove member"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add member */}
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium text-gray-700">Add a team member</p>

        {addError && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-2 rounded-lg">
            {addError}
          </div>
        )}

        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setSelectedVolunteer(null)
            }}
            placeholder="Search by name..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
          />
          {searching && (
            <p className="absolute right-3 top-2.5 text-xs text-gray-400">Searching...</p>
          )}
          {results.length > 0 && (
            <div className="absolute z-10 top-full mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
              {results.map((v) => (
                <button
                  key={v.id}
                  onClick={() => selectVolunteer(v)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer text-left"
                >
                  {v.avatar_url ? (
                    <img src={v.avatar_url} alt={v.name} className="w-6 h-6 rounded-full object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs flex-shrink-0">
                      {v.name.charAt(0)}
                    </div>
                  )}
                  {v.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <input
            type="text"
            value={roleTitle}
            onChange={(e) => setRoleTitle(e.target.value)}
            placeholder="Role title (optional)"
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
          />
          <label className="flex items-center gap-1.5 text-sm text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              checked={isLead}
              onChange={(e) => setIsLead(e.target.checked)}
              className="cursor-pointer"
            />
            Lead
          </label>
        </div>

        <button
          onClick={handleAdd}
          disabled={!selectedVolunteer || adding}
          className="self-start text-sm bg-brand-blue text-white px-4 py-2 rounded hover:opacity-90 transition-opacity disabled:opacity-40 cursor-pointer"
        >
          {adding ? 'Adding...' : 'Add Member'}
        </button>
      </div>
    </div>
  )
}
