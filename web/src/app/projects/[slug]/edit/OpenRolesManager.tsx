'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { OpenRole } from '@/lib/types'

export default function OpenRolesManager({
  projectId,
  initialRoles,
}: {
  projectId: string
  initialRoles: OpenRole[]
}) {
  const supabase = createClient()
  const [roles, setRoles] = useState<OpenRole[]>(initialRoles)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setAdding(true)
    setError(null)

    const { data, error: insertError } = await supabase
      .from('open_roles')
      .insert({ project_id: projectId, title, description: description || null })
      .select()
      .single()

    if (insertError) {
      setError(insertError.message)
      setAdding(false)
      return
    }

    setRoles((prev) => [...prev, data as OpenRole])
    setTitle('')
    setDescription('')
    setAdding(false)
  }

  async function handleDelete(roleId: string) {
    const { error: deleteError } = await supabase
      .from('open_roles')
      .delete()
      .eq('id', roleId)

    if (!deleteError) {
      setRoles((prev) => prev.filter((r) => r.id !== roleId))
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Existing roles */}
      {roles.length > 0 && (
        <div className="flex flex-col gap-3">
          {roles.map((role) => (
            <div key={role.id} className="flex items-start gap-3 border border-gray-200 rounded-lg p-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{role.title}</p>
                {role.description && (
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{role.description}</p>
                )}
              </div>
              <button
                onClick={() => handleDelete(role.id)}
                className="text-gray-400 hover:text-red-500 transition-colors text-lg leading-none flex-shrink-0 cursor-pointer"
                aria-label="Delete role"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add role form */}
      <form onSubmit={handleAdd} className="flex flex-col gap-3">
        <p className="text-sm font-medium text-gray-700">Add an open role</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-2 rounded-lg">
            {error}
          </div>
        )}

        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Role title"
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What does this role involve? What skills are needed? (optional)"
          rows={3}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent resize-none"
        />
        <button
          type="submit"
          disabled={adding}
          className="self-start text-sm bg-brand-blue text-white px-4 py-2 rounded hover:opacity-90 transition-opacity disabled:opacity-40 cursor-pointer"
        >
          {adding ? 'Adding...' : 'Add Role'}
        </button>
      </form>
    </div>
  )
}
